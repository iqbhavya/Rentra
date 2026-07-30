const Listing = require("../models/listing");

// Helper function to geocode address using Nominatim (OpenStreetMap)
// Progressively simplifies the query so specific places (e.g. "IIITDM Jabalpur, Jabalpur")
// still resolve to the nearest recognizable location instead of falling back to New Delhi.
async function geocodeAddress(location, country) {
    const cleanLocation = location ? location.trim() : "";
    const cleanCountry = country ? country.trim() : "";

    // Build a list of queries from most specific to least specific
    // e.g. location = "IIITDM Jabalpur, Jabalpur", country = "India"
    // queries: ["IIITDM Jabalpur, Jabalpur, India", "Jabalpur, India", "IIITDM Jabalpur, Jabalpur", "Jabalpur"]
    const queries = [];
    const locationParts = cleanLocation.split(",").map(p => p.trim()).filter(Boolean);

    if (cleanCountry) {
        // Full location + country
        if (cleanLocation) queries.push(`${cleanLocation}, ${cleanCountry}`);
        // Progressively drop leading parts: "A, B, Country" → "B, Country"
        for (let i = 1; i < locationParts.length; i++) {
            queries.push(`${locationParts.slice(i).join(", ")}, ${cleanCountry}`);
        }
    }
    // Same without country
    if (cleanLocation) queries.push(cleanLocation);
    for (let i = 1; i < locationParts.length; i++) {
        queries.push(locationParts.slice(i).join(", "));
    }

    // Remove duplicate queries while preserving order
    const uniqueQueries = [...new Set(queries)];

    const userAgent = `RentraWebApp-${Date.now()}`;

    for (const q of uniqueQueries) {
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
            const response = await fetch(url, {
                headers: { 'User-Agent': userAgent }
            });

            if (!response.ok) {
                console.warn(`Geocoding warning for query "${q}": HTTP status ${response.status}`);
                continue;
            }

            const data = await response.json();
            if (data && data.length > 0) {
                const lon = parseFloat(data[0].lon);
                const lat = parseFloat(data[0].lat);
                if (!isNaN(lon) && !isNaN(lat)) {
                    console.log(`Geocoded "${location}" → "${q}" → [${lon}, ${lat}]`);
                    return { type: "Point", coordinates: [lon, lat] };
                }
            }
        } catch (err) {
            console.error(`Geocoding error for query "${q}":`, err);
        }
    }

    // Ultimate fallback: New Delhi
    console.warn(`Geocoding failed for "${location}, ${country}" — using default (New Delhi)`);
    return { type: "Point", coordinates: [77.209, 28.6139] };
}


module.exports.index = async (req, res) => {
    const { category } = req.query;
    let allListings;
    if (category && category.trim() !== "") {
        allListings = await Listing.find({ category: category }).populate("reviews");
    } else {
        allListings = await Listing.find({}).populate("reviews");
    }
    res.render('listings/index.ejs', { listings: allListings, activeCategory: category || "" });
};

module.exports.renderNewForm = (req, res) => {

    res.render('listings/new.ejs');
};

module.exports.showListings = async (req, res) => {
    let id = req.params.id;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    }).populate("owner");
    console.log(listing.reviews);
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist");
        res.redirect('/listings');
        console.log("error got")

    } else {
        res.render('listings/show.ejs', { listing: listing });
    }

};


module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { filename, url };
    newListing.priceHistory = [{ price: req.body.listing.price, date: new Date() }];


    // Geocode property location
    newListing.geometry = await geocodeAddress(req.body.listing.location, req.body.listing.country);

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/w_250");
    res.render('listings/edit.ejs', { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const newPrice = Number(req.body.listing.price);
    const priceChanged = listing.price !== newPrice;

    if (priceChanged) {
        listing.priceHistory.push({ price: newPrice, date: new Date() });
    }

    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = newPrice;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;
    if (req.body.listing.category) {
        listing.category = req.body.listing.category;
    }

    // Geocoding update
    listing.geometry = await geocodeAddress(listing.location, listing.country);

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { filename, url };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
};

module.exports.search = async (req, res) => {
    let { q } = req.query;
    if (!q || q.trim() === "") {
        return res.redirect("/listings");
    }

    // Find listings matching the query
    let listings = await Listing.find({
        $or: [
            { location: { $regex: q, $options: "i" } },
            { title: { $regex: q, $options: "i" } },
            { country: { $regex: q, $options: "i" } }
        ]
    }).populate("reviews");

    // We use "listings" as the key here to match your EJS loop
    res.render("listings/index.ejs", { listings, activeCategory: "" });
};
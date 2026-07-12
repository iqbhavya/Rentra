const Listing = require("../models/listing");


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

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload","/upload/w_250");
    res.render('listings/edit.ejs', { listing });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;

    

    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { filename, url };
        await listing.save();
    }

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
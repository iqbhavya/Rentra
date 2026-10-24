const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guests } = req.body.booking; // Ignore totalPrice from req.body
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    // Calculate number of nights
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    // Validate dates
    if (isNaN(diffDays) || diffDays <= 0) {
        req.flash("error", "Checkout date must be after check-in date.");
        return res.redirect(`/listings/${id}`);
    }
    const guestsCount = parseInt(guests) || 1;
    if (guestsCount < 1) {
        req.flash("error", "At least 1 guest is required.");
        return res.redirect(`/listings/${id}`);
    }
    // Server-side calculation matching the frontend formula
    const pricePerNight = Number(listing.price) || 0;
    const extraGuestFee = guestsCount > 2 ? (guestsCount - 2) * 500 * diffDays : 0;
    const subtotal = (pricePerNight * diffDays) + extraGuestFee;
    const cleaningFee = 1200;
    const serviceFee = Math.round(subtotal * 0.05);
    const calculatedTotal = subtotal + cleaningFee + serviceFee;
    const newBooking = new Booking({
        listing: id,
        user: req.user._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: guestsCount,
        totalPrice: calculatedTotal // <-- Verified server-calculated price
    });
    await newBooking.save();
    req.flash("success", "Booking successful! Welcome to your next destination.");
    res.redirect("/bookings");
};

module.exports.listBookings = async (req, res) => {
    const bookings = await Booking.find({ user: req.user._id })
        .populate("listing")
        .populate("user");
    res.render("bookings/index.ejs", { bookings });
};

module.exports.cancelBooking = async (req, res) => {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking) {
        req.flash("error", "Booking not found.");
        return res.redirect("/bookings");
    }

    // Verify user owns this booking
    if (!booking.user.equals(req.user._id)) {
        req.flash("error", "You do not have permission to cancel this booking.");
        return res.redirect("/bookings");
    }

    await Booking.findByIdAndDelete(id);
    req.flash("success", "Booking cancelled successfully.");
    res.redirect("/bookings");
};

module.exports.listReceivedBookings = async (req, res) => {
    // Find all listings owned by the current user
    const myListings = await Listing.find({ owner: req.user._id }).select("_id");
    const myListingsIds = myListings.map(l => l._id);

    // Find all bookings for those listings
    const bookings = await Booking.find({ listing: { $in: myListingsIds } })
        .populate("listing")
        .populate("user")
        .sort({ createdAt: -1 });

    const { getCountryFromPhone } = require("../public/js/phoneHelper.js");
    res.render("bookings/received.ejs", { bookings, getCountryFromPhone });
};

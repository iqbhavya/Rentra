const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.createBooking = async (req, res) => {
    const { id } = req.params;
    const { checkIn, checkOut, guests, totalPrice } = req.body.booking;

    const newBooking = new Booking({
        listing: id,
        user: req.user._id,
        checkIn: new Date(checkIn),
        checkOut: new Date(checkOut),
        guests: parseInt(guests),
        totalPrice: parseFloat(totalPrice)
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

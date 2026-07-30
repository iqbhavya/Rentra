const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../Utils/wrapAsync");
const { isLoggedIn } = require("../middleware.js");
const bookingsController = require("../controllers/bookings.js");

// View user's bookings / My Bookings dashboard
router.get("/bookings", isLoggedIn, wrapAsync(bookingsController.listBookings));

// View received bookings (bookings on user's own listings)
router.get("/received-bookings", isLoggedIn, wrapAsync(bookingsController.listReceivedBookings));

// Create a new booking reservation
router.post("/listings/:id/bookings", isLoggedIn, wrapAsync(bookingsController.createBooking));

// Cancel a booking reservation
router.delete("/bookings/:id", isLoggedIn, wrapAsync(bookingsController.cancelBooking));

module.exports = router;

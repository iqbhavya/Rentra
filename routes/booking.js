const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../Utils/wrapAsync");
const { isLoggedIn } = require("../middleware.js");
const bookingsController = require("../controllers/bookings.js");

// View user's bookings / My Bookings dashboard
router.get("/bookings", isLoggedIn, wrapAsync(bookingsController.listBookings));

// Create a new booking reservation
router.post("/listings/:id/bookings", isLoggedIn, wrapAsync(bookingsController.createBooking));

// Cancel a booking reservation
router.delete("/bookings/:id", isLoggedIn, wrapAsync(bookingsController.cancelBooking));

module.exports = router;

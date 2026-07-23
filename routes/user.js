const express = require("express");
const router = express.Router();
const User = require('../models/user.js');
const wrapAsync = require("../Utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const usersController = require("../controllers/users.js")

router.route("/signup")
.get( usersController.renderSignUpForm)
.post( wrapAsync(usersController.signUp));

router.route("/login")
.get(usersController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: "/login", faliureFlash: true}),wrapAsync(usersController.login));

router.route("/verify-otp")
.get(usersController.renderVerifyOtpForm)
.post(wrapAsync(usersController.verifyOtp));

router.post("/resend-otp", wrapAsync(usersController.resendOtp));

router.get("/logout", usersController.logoutForm);

module.exports = router;
const User = require('../models/user.js');


const sendOtpEmail = async (email, otp) => {
    const brevoApiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.EMAIL_USER || "firewithin2520@gmail.com";


    console.log(`🔑 OTP generated for ${email}: ${otp}`);


    if (brevoApiKey) {
        try {
            const response = await fetch("https://api.brevo.com/v3/smtp/email", {
                method: "POST",
                headers: {
                    "accept": "application/json",
                    "api-key": brevoApiKey,
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    sender: {
                        name: "Rentra Support",
                        email: senderEmail
                    },
                    to: [
                        {
                            email: email
                        }
                    ],
                    subject: "Verify Your Email - Rentra",
                    htmlContent: `
                        <div style="font-family: 'Plus Jakarta Sans', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eeeeee; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                            <div style="text-align: center; border-bottom: 1px solid #eeeeee; padding-bottom: 20px;">
                                <h2 style="color: #ff385c; margin: 0; font-size: 1.8rem; font-weight: 800;">Rentra</h2>
                            </div>
                            <div style="padding: 20px 0;">
                                <p style="font-size: 1rem; color: #222222; margin-top: 0;">Hi there,</p>
                                <p style="font-size: 1rem; color: #717171; line-height: 1.5;">Thank you for registering with Rentra. To complete your signup, please use the following One-Time Password (OTP) to verify your email address:</p>
                                <div style="text-align: center; margin: 30px 0;">
                                    <span style="display: inline-block; background-color: #f7f7f7; color: #ff385c; font-size: 2.2rem; font-weight: 800; padding: 12px 30px; letter-spacing: 6px; border-radius: 8px; border: 1px solid #dddddd;">${otp}</span>
                                </div>
                                <p style="font-size: 0.9rem; color: #717171; line-height: 1.5;">This OTP is valid for <strong>5 minutes</strong>. If you did not request this verification, please ignore this email.</p>
                            </div>
                            <div style="border-top: 1px solid #eeeeee; padding-top: 20px; text-align: center; font-size: 0.8rem; color: #b0b0b0;">
                                &copy; 2026 Rentra Inc. All rights reserved.
                            </div>
                        </div>
                    `
                })
            });

            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || `HTTP error ${response.status}`);
            }

            console.log(`📧 OTP email successfully sent to ${email}`);
        } catch (error) {
            console.error("❌ Error sending OTP email via Brevo API:", error);
        }
    } else {
        console.log("⚠️ Brevo API key not configured in environment (.env). Code logged above for local testing.");
    }
};

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        // Check if username or email already exists
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            req.flash("error", "Username or Email is already registered!");
            return res.redirect("/signup");
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

        // Save data to session
        req.session.otpData = {
            username,
            email,
            password,
            otp,
            expiresAt
        };

        // Send OTP email
        await sendOtpEmail(email, otp);

        req.flash("success", "Verification code sent to your email!");
        res.redirect("/verify-otp");

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderVerifyOtpForm = (req, res) => {
    if (!req.session.otpData) {
        req.flash("error", "No signup session found. Please sign up first.");
        return res.redirect("/signup");
    }
    res.render("users/verify-otp.ejs", { email: req.session.otpData.email });
};

module.exports.verifyOtp = async (req, res, next) => {
    try {
        const { otp } = req.body;
        const otpData = req.session.otpData;

        if (!otpData) {
            req.flash("error", "Signup session expired. Please sign up again.");
            return res.redirect("/signup");
        }

        if (Date.now() > otpData.expiresAt) {
            delete req.session.otpData;
            req.flash("error", "OTP has expired. Please sign up again.");
            return res.redirect("/signup");
        }

        if (otp !== otpData.otp) {
            req.flash("error", "Invalid verification code. Please try again.");
            return res.render("users/verify-otp.ejs", { email: otpData.email });
        }

        // OTP is correct! Create user
        const { username, email, password } = otpData;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        // Clear OTP data from session
        delete req.session.otpData;

        // Login the user
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Rentra! Your email has been verified.");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.resendOtp = async (req, res) => {
    try {
        const otpData = req.session.otpData;

        if (!otpData) {
            req.flash("error", "Session expired. Please sign up again.");
            return res.redirect("/signup");
        }

        // Generate new OTP
        const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
        otpData.otp = newOtp;
        otpData.expiresAt = Date.now() + 5 * 60 * 1000;
        req.session.otpData = otpData;

        // Send email
        await sendOtpEmail(otpData.email, newOtp);

        req.flash("success", "A new OTP code has been sent!");
        res.redirect("/verify-otp");

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Rentra!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logoutForm = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        } else {
            req.flash("success", "You are logged out!");
            res.redirect("/listings");
        }
    });
};
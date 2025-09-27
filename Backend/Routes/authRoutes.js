const express = require("express");
const { Register, Login, Logout, sendVerifyOtp, verifyEmail, isAuth, sendResetOtp, ResetPassword } = require("../Controller/userAuth");
const userAuth = require("../middleware/userAuth");
const router = express.Router();

router.post("/register", Register);
router.post("/login", Login);
router.post("/logout", Logout);
router.post("/send-verify-otp", userAuth,sendVerifyOtp);
router.post("/verify-email",userAuth,verifyEmail)
router.get("/isAuth",isAuth)
router.post("/send-reset-otp",sendResetOtp)
router.post("/reset-password",ResetPassword)


module.exports = router;
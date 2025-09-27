const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require("../Nodemailer");

// REGISTER
const Register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    try {
      await transporter.sendMail({
        from: process.env.SENDERMAIL,
        to: email,
        subject: "Welcome to Kripa Stack",
        text: `Welcome! You have successfully registered with: ${email}`
      });
    } catch (err) {
      console.error("Email sending failed:", err.message);
    }

    return res.json({ success: true, message: "User registered successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// LOGIN
const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Password doesn't match" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    // ✅ Return user data along with success
    return res.json({
      success: true,
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAccountVerify: user.isAccountVerify
      }
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};


// LOGOUT
const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logout Successful" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// SEND VERIFICATION OTP
const sendVerifyOtp = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await userModel.findById(userId);
    if (user.isAccountVerify) {
      return res.json({ success: false, message: "User already verified" });
    }
    const OTP = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOTP = OTP;
    user.verifyOTPExpireAT = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDERMAIL,
      to: user.email,
      subject: "Account Verification OTP",
      text: `Your OTP is ${OTP}. Verify your account using this OTP.`
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

// VERIFY EMAIL
const verifyEmail = async (req, res) => {
  const userId = req.userId;
  const { OTP } = req.body;
  if (!userId || !OTP) {
    return res.json({ success: false, message: "Missing Field" });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (!user.verifyOTP || user.verifyOTP !== OTP) {
      return res.json({ success: false, message: "OTP not matched" });
    }
    if (user.verifyOTPExpireAT < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerify = true;
    user.verifyOTP = "";
    user.verifyOTPExpireAT = 0;
    await user.save();

    return res.json({ success: true, message: "Account successfully verified" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// AUTH CHECK
const isAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select("-password");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (!user.isAccountVerify) {
      return res.json({ success: false, message: "Account not verified" });
    }

    return res.json({ success: true, user });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// SEND RESET OTP
const sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Email required" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User Not Found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.ResetOTP = otp;
    user.ResetOTPExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    await transporter.sendMail({
      from: process.env.SENDERMAIL,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. Use this OTP to change your password.`
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

// RESET PASSWORD
const ResetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Missing credentials" });
  }
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (!user.ResetOTP || user.ResetOTP !== otp) {
      return res.json({ success: false, message: "OTP not matched" });
    }
    if (user.ResetOTPExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.ResetOTP = "";
    user.ResetOTPExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

module.exports = {
  Register,
  Login,
  Logout,
  sendVerifyOtp,
  verifyEmail,
  isAuth,
  sendResetOtp,
  ResetPassword
};

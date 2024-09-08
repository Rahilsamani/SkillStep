const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

// SignUp
const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, otp } =
      req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res
        .status(403)
        .json({ success: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User is already registered" });
    }

    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);

    if (response.length === 0) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    } else if (otp !== response[0].otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    return res
      .status(200)
      .json({ success: true, user, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again",
    });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Please fill up all the required fields",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User is not registered, please sign up first",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully",
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Password is incorrect" });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Login failed, please try again" });
  }
};

// Send OTP
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const checkUserPresent = await User.findOne({ email });

    if (checkUserPresent) {
      return res
        .status(401)
        .json({ success: false, message: "User already registered" });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
    }

    const otpPayload = { email, otp };
    await OTP.create(otpPayload);

    res
      .status(200)
      .json({ success: true, message: "OTP sent successfully", otp });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const userDetails = await User.findById(req.user.id);
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "The password is incorrect" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(401).json({
        success: false,
        message: "The new password and confirm password do not match",
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    try {
      await mailSender(
        userDetails.email,
        passwordUpdated(
          userDetails.email,
          `Password updated successfully for ${userDetails.firstName} ${userDetails.lastName}`
        )
      );
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error occurred while updating password:", error);
    return res.status(500).json({
      success: false,
      message: "Error occurred while updating password",
      error: error.message,
    });
  }
};

module.exports = { signUp, login, sendOTP, changePassword };

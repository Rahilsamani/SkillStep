const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// Generate Password Reset Token and Send Email
const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Email not registered.",
      });
    }

    // Generate token and set expiration time
    const token = crypto.randomBytes(20).toString("hex");
    user.token = token;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10-minute expiration
    await user.save();

    const resetLink = `https://skillstep.vercel.app/update-password/${token}`;
    await mailSender(
      email,
      "Password Reset Link",
      `Click the following link to reset your password: ${resetLink}`
    );

    return res.status(200).json({
      success: true,
      message: "Password reset link sent. Please check your email.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while sending password reset email.",
      error: error.message,
    });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const user = await User.findOne({
      token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.token = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while resetting password.",
      error: error.message,
    });
  }
};

module.exports = { resetPasswordToken, resetPassword };

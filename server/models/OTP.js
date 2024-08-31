const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

//a function -> to send emails of otp by using nodemailer which was created in "/utils/mailSender"
// * * Always return good console messages. developer should know where the program is not working
async function sendVerificationEmail(email, otp) {
  try {
    await mailSender(
      email,
      "Verification Email from SkillStep",
      emailTemplate(otp)
    );
  } catch (error) {
    console.log("error occured while sending mails: ", error);
    throw error;
  }
}

// * * Pre save middleware means otp.create hone se pehle ye execute hoga
OTPSchema.pre("save", async function (next) {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);

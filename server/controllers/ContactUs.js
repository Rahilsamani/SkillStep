const { contactUsEmail } = require("../mail/templates/contactFormResponse");
const mailSender = require("../utils/mailSender");

exports.contactUsController = async (req, res) => {
  const { email, firstname, lastname, message, phoneNo, countrycode } =
    req.body;

  try {
    // Send confirmation email to the user
    await mailSender(
      email,
      "Your Data was sent successfully",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );

    // Send notification email to the admin
    await mailSender(
      "rahilahmed1720@gmail.com",
      "New Contact Form Submission",
      contactUsEmail(email, firstname, lastname, message, phoneNo, countrycode)
    );

    return res.json({
      success: true,
      message: "Emails sent successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Something went wrong while sending the email.",
      error: error.message,
    });
  }
};

const mailSender = require("../utils/mailSender");
const certificateTemplate = require("../mail/templates/certificate");

exports.sendCertificate = async (user, course, userCourse) => {
  try {
    const formattedCompletionDate = new Date(
      userCourse.completionDate
    ).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const title = `Your Certificate of Completion for ${course.Author}`;
    const body = certificateTemplate(
      user.firstName,
      user.lastName,
      course.Author,
      formattedCompletionDate
    );
    await mailSender(user.email, title, body);

    userCourse.certificateIssued = true;
    await user.save();

    console.log("Certificate successfully generated and sent!");
  } catch (error) {
    console.error("Error in sending certificate:", error.message);
  }
};

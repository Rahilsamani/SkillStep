const nodemailer = require("nodemailer");

const mailSender = async (email, title, body, attachments = []) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    let info = await transporter.sendMail({
      from: "SkillStep - by Rahil Ahmed",
      to: `${email}`,
      subject: `${title}`,
      html: `${body}`,
      attachments: attachments,
    });
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = mailSender;

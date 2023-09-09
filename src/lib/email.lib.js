const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "foleyb25@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: options.email,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });

  return info;
};

module.exports = {
  sendEmail,
};

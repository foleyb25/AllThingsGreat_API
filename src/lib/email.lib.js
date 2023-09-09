const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "foleyb25@gmail.com",
      clientId: process.env.MAIL_CLIENT,
      clientSecret: process.env.MAIL_SECRET,
      refreshToken: process.env.MAIL_REFRESH_TOKEN,
    },
  });
  const info = await transporter.sendMail({
    from: options.email,
    to: options.to,
    subject: options.text,
    text: options.text,
    html: options.html,
  });

  return info;
};

module.exports = {
  sendEmail,
};

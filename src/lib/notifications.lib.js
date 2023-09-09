const { sendEmail } = require("./email.lib");

exports.sendFirstServiceEmail = async (data) => {
  let options = {
    from: data.email,
    to: "foleyb25@gmail.com",
    subject: `[MESSAGE FROM https://firstservicegroup.net] ${data.subject}`,
    text: `
    Message from ${data.fullName}
    Email: ${data.email}

    Message Content:

    ${data.message}
    `,
    html: `
    <h1>Message from ${data.fullName}</h1>
    <h2>Email: ${data.email}</h2>

    <p><i>Message Content:</i></p>
    <p>${data.message}</p>
    `,
  };

  return await sendEmail(options);
};

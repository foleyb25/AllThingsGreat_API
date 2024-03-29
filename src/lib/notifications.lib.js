const { sendEmail } = require("./email.lib");

exports.sendFirstServiceEmail = async (data) => {
  let mailList = ["kfoley8132@gmail.com", "samanthayearry@gmail.com"];
  let options = {
    from: data.email,
    to: mailList,
    subject: `[MESSAGE FROM https://firstservicesgroup.net] ${data.subject}`,
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

const sgMail = require("@sendgrid/mail");
const from = "kwhite11419@gmail.com";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from,
    subject: "Thanks for joining",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

const sendCancellationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from,
    subject: "Sorry to see you go",
    text: `Sorry to see you go, ${name}`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};

// yourController.js
const emailService = require("../emailService");

const sendUpdateEmail = async (email, messag) => {
  const to = email;
  console.log("this is me", to);
  const message = messag;
  const subject = "TICKET UPDATE";
  const text = `${message}`;
  const html = `<p><strong>${message}</strong></p>`;

  try {
    const mama = await emailService.sendEmail(to, subject, text, html);
    return mama;
    // Handle result if needed
  } catch (error) {
    // Handle error
    throw error;
  }
};

module.exports = { sendUpdateEmail };

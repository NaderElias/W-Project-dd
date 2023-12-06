// emailService.js
const nodemailer = require('nodemailer');
const emailConfig = require('./emailConfig');

const transporter = nodemailer.createTransport({

  service: emailConfig.service,
  auth: emailConfig.auth,
});

const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: emailConfig.auth.user,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = { sendEmail };

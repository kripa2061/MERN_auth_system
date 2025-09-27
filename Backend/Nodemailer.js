const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for port 465, false for 587
  auth: {
    user: process.env.SMTPUSER,
    pass: process.env.SMTPPASS
  }
});

module.exports = transporter;

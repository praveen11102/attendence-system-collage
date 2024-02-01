// config/email.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'killerpraveen11102@gmail.com',
    pass: 'orilktfqvbjgewje',
  },
});

module.exports = transporter;

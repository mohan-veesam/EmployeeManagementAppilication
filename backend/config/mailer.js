const nodemailer = require('nodemailer');

module.exports = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your.email@gmail.com',
    pass: 'your-app-password'  // Use App Password, not your Gmail password
  }
});

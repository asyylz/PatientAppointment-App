const dotenv = require('dotenv');

dotenv.config({ path: './.env.local' });

const nodemailer = require('nodemailer');

const sendEmail = async options => {
  //mailtrap
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USERNAME,
  //     pass: process.env.EMAIL_PASSWORD
  //   }
  // });
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      // user: 'asiyeyaliz@gmail.com',
      user: process.env.GMAIL_EMAIL_USERNAME,
      //pass: 'hmqp yjwy oloo pdjd'
      pass: process.env.GMAIL_EMAIL_PASSWORD
    }
  });

  //console.log('from email', options.email);
  const mailOptions = {
    from: process.env.GMAIL_EMAIL_USER,
    to: options.email,
    subject: options.subject,
    text: options.message
    // html
  };

  await transporter.sendMail(mailOptions);
  console.log('Email sent');
};

module.exports = sendEmail;

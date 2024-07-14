const nodemailer = require('nodemailer');

module.exports = function(to, subject, message) {
  //* GoogleMail (gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      //   user: "devfs99@gmail.com",
      user: process.env.GMAIL_EMAIL_USER,
      //   pass: "hmqp yjwy oloo pdjd",
      pass: process.env.GMAIL_EMAIL_PASS
    }
  });

  //   const mailOptions = {
  //     from: 'Hospital Appointment <hello@asiye.io>',
  //     to: options.email,
  //     subject: options.subject,
  //     text: options.message
  //     // html
  //   };

  transporter.sendMail(
    {
      to: to,
      subject: subject,
      html: message
    },
    (error, success) => console.log(success, error)
  );
};

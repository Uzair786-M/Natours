const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create Transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) Set options like to,from,subject and message
  const emailOptions = {
    to: options.email,
    from: 'Uzair Maqbool <Uzairmaqbool050@gmail.com>',
    subject: 'To reset your password',
    text: options.message,
  };

  // 3) Send mail to client

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;

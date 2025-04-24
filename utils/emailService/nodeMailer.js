import nodemailer from "nodemailer";
import dotenv from "dotenv";


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // TLS
    secure: false, 
    auth: {
      user: process.env.NODEMAILER_EMAIL_USER, // email for sending mail
      pass: process.env.NODEMAILER_EMAIL_PASS,
    },
    logger: true, // Logs SMTP communication
    debug: true, // Enables debugging output
});

// async..await is not allowed in global scope, must use a wrapper
async function sendMailService(from, to, subject, text, html, mailOption) {
    // send mail with defined transport object
    // const { mailType, mailSendStartDate, mailSendFinishDate, mailSendFinishTime } = mailOption

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};


export default sendMailService;
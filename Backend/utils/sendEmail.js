import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    // 🚨 NAYA TRANSPORTER SETUP (service: 'Gmail' hata diya hai)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,             // Naya Port
      secure: false,         // 587 ke liye false hota hai
      requireTLS: true,      // Security ke liye
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: 'AI-HIRE Support <' + process.env.EMAIL_USER + '>',
      to: options.to,
      subject: options.subject,
      html: options.text,
    };

    await transporter.sendMail(mailOptions);
    console.log("🟢 Email successfully sent to:", options.to);

  } catch (error) {
    console.error("❌ Email bhejne mein error aayi:", error);
    throw new Error('Email sending failed');
  }
};

export default sendEmail;
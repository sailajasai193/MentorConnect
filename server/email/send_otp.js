const nodemailer=require("nodemailer");
const dotenv=require("dotenv")
dotenv.config()

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendOtpEmail=async(email,otp)=>{
    await transporter.sendMail({
    from: `"OTP Verification" <${process.env.EMAIL_USER}`,
    to: email,
    subject: "Your OTP Code",
    html: `<h2>Your OTP is:${otp}</h2><p>Valid only for 5 minutes</p>`
  });

}

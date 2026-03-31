const express = require("express");
const router = express.Router();
const userModel = require("../Models/UserSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const otpStore = require("../email/otpStore");
const { generateOtp } = require("../email/generateOtp");
const { sendOtpEmail } = require("../email/send_otp");


const allowedIitDomains = [
"@iitb.ac.in",
"@iitd.ac.in",
"@iitk.ac.in",
"@iitm.ac.in",
"@iitkgp.ac.in",
"@iitg.ac.in",
"@iitroorkee.ac.in",
"@iitdh.ac.in",
"@iitbhilai.ac.in",
"@iitgoa.ac.in",
"@iitj.ac.in",
"@iitmandi.ac.in",
"@iitrpr.ac.in",
"@iitp.ac.in",
"@iitbbs.ac.in",
"@iitism.ac.in",
"@iitgn.ac.in",
"@iitpkd.ac.in",
"@iittp.ac.in",
"@iiti.ac.in",
"@iitpalakkad.ac.in",
"@iitdharwad.ac.in",
"vishnu.edu.in"
];


// REGISTER API
router.post("/register", async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Mentor email validation
    if (role === "mentor") {

      const validDomain = allowedIitDomains.some(domain =>
        email.endsWith(domain)
      );

      if (!validDomain) {
        return res.status(400).json({
          message: "Mentors must register with IIT email"
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();

    otpStore[email] = {
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      createdAt: Date.now()
    };

    await sendOtpEmail(email, otp);

    res.json({
      message: "OTP sent to email"
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});



// VERIFY OTP API
router.post("/verify-otp", async (req, res) => {
  try {

    const { email, otp } = req.body;

    const storedData = otpStore[email];

    if (!storedData) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // OTP expiry check (5 minutes)
    if (Date.now() - storedData.createdAt > 5 * 60 * 1000) {
      delete otpStore[email];
      return res.status(400).json({ message: "OTP expired" });
    }

    if (storedData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const newUser = new userModel({
      name: storedData.name,
      email: storedData.email,
      password: storedData.password,
      role: storedData.role
    });

    await newUser.save();

    delete otpStore[email];

    const token = jwt.sign(
      { userId: newUser._id, name: newUser.name,role: newUser.role ,email: newUser.email,  },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Registration successful",
      token,
      role: newUser.role

    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});



// LOGIN API
router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id, name: user.name,role: user.role ,email:user.email},
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      name: user.name,
      role:user.role
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
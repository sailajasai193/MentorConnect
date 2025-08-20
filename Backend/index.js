const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const nodemailer=require('nodemailer');


const app = express();
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());


const EmployeeModel=require('./Models/Employee')
const Mentormodel = require('./Models/Mentors');
const Employeemodel = require('./Models/Employee');


mongoose.connect("mongodb://localhost:27017/employeesDB")


app.post('/login', (req, res) => {
  const { email, password } = req.body;
  EmployeeModel.findOne({ email: email })
    .then(user => {
      if (user) {
        if (user.password === password) {
          res.json("success");
        } else {
          res.json("Password is Incorrect");
        }
      } else {
        res.json("No record Existed");
      }
    })
    .catch(err => {
      console.error("Login error:", err);
      res.status(500).json("Server error");
    });
});


app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    const newUser = await EmployeeModel.create({ name, email, password });
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Error in /register:", err);
    res.status(500).json({ message: "Server error" });
  }
});


app.get('/getmentors', (req, res) => {
  Mentormodel.find()
    .then(mentors => {
      res.json(mentors);
    })
    .catch(err => res.json(err));
});


app.post('/sendemail', async (req, res) => {
  const { email, name: mentorname } = req.body;

  try {
    const mentor = await Mentormodel.findOne({ name: mentorname });
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });
    const mentoremail = mentor.email;
    const user = await EmployeeModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const username = user.name;
     const mailText = `
            Hello ${username},
            This is your Mentor ${mentorname}. Thanks for connecting with me.
            For further details or to get in touch, click the link below:
            Looking forward to guiding you!

            - The Team`;

    console.log("Sending to:", email, mentoremail);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'sailajasainilla19@gmail.com',
        pass: 'qsvdxtbavlcbdpzw' 
      }
    });

    const mailOptions = {
      from: 'sailajasainilla19@gmail.com',
      to: [email, mentoremail],
      subject: 'Connected with Mentor',
      text: mailText
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    res.json({ success: true, message: 'Email sent!' });

  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});



app.listen(5000, () => {
    console.log("server running on port 5000");
});

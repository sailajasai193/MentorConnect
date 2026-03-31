const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const mongoose=require('mongoose');
const path = require('path');
const nodemailer = require('nodemailer');
const cors = require('cors');
const authMiddleware = require("../Middleware/AuthMiddleware");

const User = require("../Models/UserSchema");
const Session = require("../Models/sessionSchema");
const MeetingNotes = require("../Models/AISummarySchema");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', authMiddleware, upload.single('audio'), async (req, res) => {
  try {
    const filePath = req.file.path;

    const mentorId = req.user.id;
    const mentorEmail = req.user.email;

    console.log("Logged-in user:", req.user);
    console.log("Mentor email:", mentorEmail);

    const studentEmail = req.body.email;   // keep your same field
    console.log("student email:", studentEmail);

    
    res.json({
      message: 'Processing started, summary will be emailed within 5 minutes'
    });

    
    const scriptPath = path.join(__dirname, 'transcribe_summarize.py');
    const python = spawn('python', [scriptPath, filePath]);

    let result = '';

    python.stdout.on('data', (data) => {
      result += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error('Python error:', data.toString());
    });

    python.on('close', async (code) => {
      if (code !== 0) {
        console.error('Python process exited with code', code);
        return;
      }

      try {
  
        const student = await User.findOne({ email: studentEmail });
        if (!student) {
          console.error("Student not found");
          return;
        }

        const now = new Date();
      const mentorId = req.user.userId;

console.log("mentorId:", mentorId);
console.log("studentId:", student._id);
      const selectedSession = await Session.findOne({
  mentor: mentorId,
  student: student._id,
  status: { $regex: /^completed$/i }
}).sort({ date: -1 });

  

   

        if (!selectedSession) {
          console.error("No completed session found");
          return;
        }

        let transcript = "";
        let summary = result;

        try {
          const parsed = JSON.parse(result);
          transcript = parsed.transcript || "";
          summary = parsed.summary || result;
        } catch {
          summary = result; // plain text fallback
        }

        
        const note = new MeetingNotes({
          mentorId,
          studentId: student._id,
          sessionId: selectedSession._id,
          meetingDate: selectedSession.date,
          transcript,
          summary
        });

        await note.save();
        console.log("Meeting notes saved");

       
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: `${mentorEmail},${studentEmail}`,
          subject: 'Audio Summary',
          text: summary || 'No summary generated',
        };

        await transporter.sendMail(mailOptions);
        console.log('Summary sent to mentor and student');

      } catch (err) {
        console.error('Post-processing error:', err);
      }
    });

  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
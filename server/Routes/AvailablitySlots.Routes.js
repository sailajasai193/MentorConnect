const express = require("express");
const router = express.Router();
const Availability = require("../Models/AvailabilitySchema");
const MentorProfile = require("../Models/MentorSchema");
const authMiddleware = require("../Middleware/AuthMiddleware");
const User=require("../Models/UserSchema");
const Session = require("../Models/sessionSchema");
const nodemailer = require("nodemailer");
const MeetingNotes = require("../Models/AISummarySchema");


const { createGoogleMeet } = require("../GoogleMeet/createMeet");

require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});



router.post("/add",authMiddleware, async (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    const availabilityTime=new Availability({
      mentorId:req.user.userId,
      date,
      startTime,
      endTime,
      isBooked:false,
    });

    const savedSlot = await availabilityTime.save();

    res.json({
      message: "Slot added successfully",
      slot: savedSlot,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// -----------------------------
// GET ALL SLOTS (Mentor Dashboard)
// -----------------------------
router.get("/all", authMiddleware, async (req, res) => {
  try {
    const slots = await Availability.find({
      mentorId: req.user.userId,
    });
    res.json(slots);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// -----------------------------
// GET ALL AVAILABLE SLOTS (Student View)
// -----------------------------


router.get("/allmentors", authMiddleware, async (req, res) => {
  try {
    // Fetch all available slots in future
    const slots = await Availability.find({
      isBooked: false,
      date: { $gte: new Date().toISOString().split("T")[0] },
    })
      .populate("mentorId", "name email role") // populate basic user info
      .lean();

    // Map slots to include full MentorProfile
    const finalData = await Promise.all(
      slots.map(async (slot) => {
        if (!slot.mentorId) {
          console.warn("Skipping slot with null mentorId", slot._id);
          return null; // skip invalid slots
        }

        // Find the mentor profile using userId
        const profile = await MentorProfile.findOne({ userId: slot.mentorId._id }).lean();

        return {
          slotId: slot._id,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          isBooked: slot.isBooked,
          mentor: {
            _id: slot.mentorId._id,
            name: slot.mentorId.name,
            email: slot.mentorId.email,
            role: slot.mentorId.role,
            headline: profile?.headline || "",
            college: profile?.college || "",
            languages: profile?.languages || [],
            about: profile?.about || "",
            linkedin: profile?.linkedin || "",
            pricePerSession: profile?.pricePerSession || 0,
            availability: profile?.availability || [],
          }
        };
      })
    );

    // Remove null entries (slots with missing mentor)
    res.json(finalData.filter(item => item !== null));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


// -----------------------------
// BOOK SLOT (Student)
// -----------------------------
router.post("/book/:id", authMiddleware, async (req, res) => {
  try {
    const slot = await Availability.findOneAndUpdate(
      { _id: req.params.id, isBooked: false },
      { isBooked: true, bookedBy: req.user.userId },
      { returnDocument: "after" }
    );

    if (!slot) return res.status(400).json({ message: "Slot already booked" });
    if (slot.mentorId.toString() === req.user.userId) {
      return res.status(400).json({ message: "Cannot book your own slot" });
    }

    // Fetch emails
    const student = await User.findById(req.user.userId);
    const mentor = await User.findById(slot.mentorId);

    // Create Google Meet
    const { meetingLink, eventId } = await createGoogleMeet({
      studentEmail: student.email,
      mentorEmail: mentor.email,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });

    // Save session
    const session = await Session.create({
      student: req.user.userId,
      mentor: slot.mentorId,
      date: slot.date,
      startTime: slot.startTime,   
      endTime: slot.endTime, 
      status: "upcoming",
      meetingLink,
      eventId
    });

    // Send email to student
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: `Session Booked with ${mentor.name}`,
      html: `<p>Your session is booked with <strong>${mentor.name}</strong></p>
             <p>Date: ${slot.date}</p>
             <p>Time: ${slot.startTime} - ${slot.endTime}</p>
             <p>Meeting Link: <a href="${session.meetingLink}">${session.meetingLink}</a></p>`
    });

    // Send email to mentor
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: mentor.email,
      subject: `New Session Booked by ${student.name}`,
      html: `<p>You have a new session booked by <strong>${student.name}</strong></p>
             <p>Date: ${slot.date}</p>
             <p>Time: ${slot.startTime} - ${slot.endTime}</p>
             <p>Meeting Link: <a href="${session.meetingLink}">${session.meetingLink}</a></p>`
    });

    res.json({
      message: "Slot booked and session created successfully",
      session
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});






// GET /api/sessions/upcoming
router.get("/upcoming", authMiddleware, async (req, res) => {
  try {
    const now = new Date();

    const sessions = await Session.find({
      mentor: req.user.userId,
      status: "upcoming",
      date: { $gte: now.toISOString().split("T")[0] }, // today or future
    })
      .populate("student", "name email")
      .lean();

    const filteredSessions = sessions.filter((s) => {
      if (!s.startTime) return false;

      // Normalize startTime, remove AM/PM and extra spaces
      let startTime = s.startTime.trim();

      // Convert 12-hour format (if stored like "2:30 PM") to 24-hour
      const timeMatch = startTime.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (!timeMatch) return false;

      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const meridiem = timeMatch[3]?.toUpperCase();

      if (meridiem === "PM" && hours < 12) hours += 12;
      if (meridiem === "AM" && hours === 12) hours = 0;

      const sessionDateTime = new Date(s.date);
      sessionDateTime.setHours(hours, minutes, 0, 0);

      return sessionDateTime > now;
    });

    res.json(filteredSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



// DELETE SLOT
router.delete("/:slotId", authMiddleware, async (req, res) => {
  try {
    await Availability.findByIdAndDelete(req.params.slotId);
    res.json({
      message:"Slot deleted successfully"
    });

  } catch (error) {
     console.error(err);
    res.status(500).json({ message:"Server error"});
  }
});




router.get("/completed", authMiddleware, async (req, res) => {
  try {
    const mentorId = req.user.userId; // ✅ correct field

    const sessions = await Session.find({ mentor: mentorId }).populate("student");

    const now = new Date();

    const completedSessions = [];

    for (let session of sessions) {

      if (!session.date || !session.endTime) continue;

      // ✅ create proper local datetime
      const [endH, endM] = session.endTime.split(":").map(Number);

      const sessionEnd = new Date(session.date);
      sessionEnd.setHours(endH, endM, 0, 0);

      // ✅ check if session ended
      if (sessionEnd <= now) {

        // 🔥 auto update status
        if (session.status !== "completed") {
          session.status = "completed";
          await session.save();
        }

        completedSessions.push(session);
      }
    }

    res.json(completedSessions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});








router.get("/history", authMiddleware, async (req, res) => {
  try {
    const mentorId = req.user.userId;   // 🔥 logged-in mentor

    console.log("Mentor ID:", mentorId);

    const notes = await MeetingNotes.find({
      mentorId: mentorId
    })
      .populate("studentId", "name email")   // 🔥 student details
      .sort({ meetingDate: -1 });

    if (!notes || notes.length === 0) {
      return res.status(404).json({
        message: "No session history found"
      });
    }
     console.log("First note studentId:", notes[0]?.studentId);
    // ✅ Format response for frontend
    const formatted = notes.map((note) => ({
      _id: note._id,
      studentName: note.studentId?.name,
      studentEmail: note.studentId?.email,
      date: note.meetingDate,
      summary: note.summary
    }));

    res.status(200).json(formatted);

  } catch (err) {
    console.error("Error fetching session history:", err);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports=router;

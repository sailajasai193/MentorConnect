const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/AuthMiddleware");
const Session = require("../Models/sessionSchema");
const MeetingNotes=require("../Models/AISummarySchema");

const app = express();
const cors = require('cors');
app.use(cors());


router.get("/st/upcoming", authMiddleware, async (req, res) => {
  try {
    const now = new Date();

    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

    // 👉 Fetch today's + future sessions
    const sessions = await Session.find({
      student: req.user.userId, // ✅ FIXED
      status: "upcoming",
      date: { $gte: todayStr }
    })
      .populate("mentor", "name email")
      .lean();

    // 👉 Filter out past time slots (today only)
    const filteredSessions = sessions.filter((s) => {
      if (!s.startTime || !s.endTime) return false;

      const [endHours, endMinutes] = s.endTime.split(":").map(Number);

      const sessionEnd = new Date(s.date);
      sessionEnd.setHours(endHours, endMinutes, 0, 0);

      return now <= sessionEnd; // only future sessions
    });

    res.json(filteredSessions);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/st/completed", authMiddleware, async (req, res) => {
  try {
    const studentId = req.user.userId; // student id from JWT

    const sessions = await Session.find({ student: studentId })
      .populate("mentor", "name email") // populate mentor info
      .populate("student", "name email"); // optional

    const now = new Date();

    const completedSessions = [];

    for (let session of sessions) {
      if (!session.date || !session.endTime) continue;

      // Parse end time
      const [endH, endM] = session.endTime.split(":").map(Number);
      const sessionEnd = new Date(session.date);
      sessionEnd.setHours(endH, endM, 0, 0);

      // Check if session ended
      if (sessionEnd <= now) {
        // Auto-update status if not already completed
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


// Get session history for logged-in student
router.get("/st/sessionhistory", authMiddleware, async (req, res) => {
  try {
    const studentId = req.user.userId;   // 🔥 logged-in student

    const notes = await MeetingNotes.find({
      studentId: studentId
    })
      .populate("mentorId", "name email")   // 🔥 mentor details
      .sort({ meetingDate: -1 });

    if (!notes || notes.length === 0) {
      return res.status(404).json({
        message: "No session history found"
      });
    }

    console.log("First note mentorId:", notes[0]?.mentorId);

    const formatted = notes.map((note) => ({
      _id: note._id,
      mentorName: note.mentorId?.name,
      mentorEmail: note.mentorId?.email,
      date: note.meetingDate,
      summary: note.summary
    }));

    res.status(200).json(formatted);

  } catch (err) {
    console.error("Error fetching session history:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;


module.exports = router;
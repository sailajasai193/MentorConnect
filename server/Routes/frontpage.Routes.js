const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/AuthMiddleware");
const Session = require("../Models/sessionSchema");

// Get today's sessions for mentor
router.get("/session", authMiddleware, async (req, res) => {
  try {
    const mentorId = req.user.userId;

    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

    const sessions = await Session.find({
      mentor: mentorId,
      date: todayStr,     // ✅ exact match
      status: "upcoming"
    })
    .populate("student", "name email")
    .populate("mentor", "name email");

    console.log("Today's sessions:", sessions);

    res.json(sessions);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/stats", authMiddleware, async (req, res) => {
  try {
    const mentorId = req.user.userId;

    const sessions = await Session.find({ mentor: mentorId });

   
    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

    
    const totalSessions = sessions.length;

    
    const completedSessions = sessions.filter((s) => {
      return s.date < todayStr;
    }).length;

   
    const todaySessions = sessions.filter((s) => {
      return s.date === todayStr;
    }).length;

    

    const current = new Date();
    const day = current.getDay();

    // Get Monday
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);

    const startOfWeek = new Date(current);
    startOfWeek.setDate(diff);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    // Convert to string format
    const startStr = startOfWeek.toLocaleDateString("en-CA");
    const endStr = endOfWeek.toLocaleDateString("en-CA");

   
    const sessionsThisWeek = sessions.filter((s) => {
      return s.date >= startStr && s.date <= endStr;
    }).length;

   
    const upcomingSessions = sessions.filter((s) => {
      return s.date > todayStr;
    }).length;

    
    console.log("Today:", todayStr);
    console.log("Week Start:", startStr);
    console.log("Week End:", endStr);

    sessions.forEach((s) => {
      console.log("Session Date:", s.date);
    });

    
    res.json({
      totalSessions,
      completedSessions,
      todaySessions,
      sessionsThisWeek,
      upcomingSessions
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/AuthMiddleware");
const Mentor = require("../Models/MentorSchema");

// POST /api/mentor/profile
router.post("/profile", authMiddleware, async (req, res) => {
  try {
    const {
      headline,
      college,
      skills,
      languagesKnown, // from frontend
      about,
      linkedin,
      pricePerSession
    } = req.body;

    // Check if mentor profile already exists
    const existingProfile = await Mentor.findOne({ userId: req.user.userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Mentor profile already exists" });
    }

    // Create new mentor profile
    const newProfile = new Mentor({
      userId: req.user.userId,
      headline,
      college,
      skills: skills || [], // optional, array of strings
      languages: languagesKnown || [],
      about,
      linkedin,
      pricePerSession
      // availability can be empty for now
    });

    await newProfile.save();

    res.status(201).json({ message: "Mentor profile created successfully" });
  } catch (error) {
    console.error("Error creating mentor profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
const mongoose = require("mongoose");

const meetingNotesSchema = new mongoose.Schema({
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session"
  },

  meetingDate: {
    type: Date,
    required: true
  },

  transcript: String,
  summary: String,

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("MeetingNotes", meetingNotesSchema);
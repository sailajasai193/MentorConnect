const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  date: {
    type: String, 
    required: true
  },

  startTime: {  
    type: String,
    required: true
  },

  endTime: {    
    type: String,
    required: true
  },

  status: {
    type: String,
    enum: ["upcoming", "completed", "cancelled"],
    default: "upcoming"
  },

  meetingLink: String,
  recording: String,
  googleEventId: String

}, { timestamps: true });

module.exports = mongoose.model("Session", sessionSchema);
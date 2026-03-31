const mongoose = require("mongoose");

const MentorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  headline: {
    type: String,
    required: true
  },

  college: {
    type: String
  },


  languages: {
    type: [String],
    default: []
  },

  about: {
    type: String,
    required: true
  },

  linkedin: {
    type: String
  },

  pricePerSession: {
    type: Number,
    required: true
  },

  availability: [
    {
      day: String,
      slots: [String]
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("MentorProfile", MentorSchema);
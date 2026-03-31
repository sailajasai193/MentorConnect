const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({

  mentorId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  date:{
    type:String
  },

  startTime:{
    type:String
  },

  endTime:{
    type:String
  },

  isBooked:{
    type:Boolean,
    default:false
  },

});

module.exports = mongoose.model("Availability",availabilitySchema);
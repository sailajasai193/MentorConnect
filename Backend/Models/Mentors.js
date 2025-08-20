const mongoose = require('mongoose');

const MentorSchema = new mongoose.Schema({
  name: String,
  College: String,
  Branch: String,        
  Language: String,
  AT: [String],             
  link: String ,
  email:String
});

const Mentormodel = mongoose.model('Mentors', MentorSchema, 'Mentors');
module.exports = Mentormodel;

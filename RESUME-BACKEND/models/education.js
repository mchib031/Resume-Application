const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const educationSchema = new Schema({
  degree: String,
  school: String,
  startDate: Date,
  endDate: Date,
  summary: String
});

const Education = mongoose.model('Education', educationSchema);

module.exports = Education;

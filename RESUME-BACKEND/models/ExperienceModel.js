const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const experienceSchema = new Schema({
  company: String,
  position: String,
  startDate: Date,
  endDate: Date,
  summary: String,
  resume: {
    type: mongoose.Types.ObjectId,
    ref: 'Resume',
    required: true
  }
});

const Experience = mongoose.model('Experience', experienceSchema);

module.exports = Experience;

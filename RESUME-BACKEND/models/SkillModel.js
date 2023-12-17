const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const skillSchema = new Schema({
  name: String,
  proficiency: String,
  summary: String,
  resume: {
    type: mongoose.Types.ObjectId,
    ref: 'Resume',
    required: true
  }
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;

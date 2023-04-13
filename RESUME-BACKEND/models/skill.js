const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const skillSchema = new Schema({
  name: String,
  proficiency: String,
  summary: String
});

const Skill = mongoose.model('Skill', skillSchema);

module.exports = Skill;

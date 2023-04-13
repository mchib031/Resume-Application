const express = require('express');
const router = express.Router();
const Education = require('../models/education');
const Experience = require('../models/experience');
const Skill = require('../models/skill');

// Resume endpoints

// Get all education data
router.get('/education', async (req, res) => {
  try {
    const educations = await Education.find({});
    res.send(educations);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to get education data');
  }
});

// Add new education data
router.post('/education', async (req, res) => {
  try {
    const education = new Education(req.body);
    const result = await education.save();
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add education data');
  }
});

// Get all job experiences
router.get('/experience', async (req, res) => {
  try {
    const experiences = await Experience.find({});
    res.send(experiences);
  } catch(err) {
    console.error(err);
    res.status(500).send('Failed to get experience data');
  }
});

// Add new job experience
router.post('/experience', async (req, res) => {
  try {
    const experience = new Experience(req.body);
    const result = await experience.save();
    res.send(experience);
  } catch(err) {
    console.error(err);
    res.status(500).send('Failed to add job experience');
  }
});

// get skills
router.get('/skills', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add new skills
router.post('/skills', async (req, res) => {
  const skill = new Skill({
    name: req.body.name,
    proficiency: req.body.proficiency,
    summary: req.body.summary
  });
  try {
    const newSkill = await skill.save();
    res.status(201).json(newSkill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

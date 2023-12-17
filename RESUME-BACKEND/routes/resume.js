const express = require('express')
const {
    getResumes,
    getResumeById,
    createResume,
    deleteResume,
    updateResume,
    createEducations,
    createExperiences,
    createSkills
} = require('../controllers/resumeController')

const router = express.Router()

// GET all Resumes
router.get('', getResumes)

// GET a Resume by id
router.get('/resume/:id/:token', getResumeById)

// POST a new Resume
router.post('', createResume)

// DELETE a Resume corresponding to id
router.delete('/resume/:id/:token', deleteResume)

// PATCH a Resume corresponding to id
router.patch('/resume/:id/:token', updateResume)

// Creates list of Skills for specified Resume
router.patch('/resume/:id/:token/createSkills', createSkills)

// Creates list of Educations for specified Resume
router.patch('/resume/:id/:token/createEducations', createEducations)

// Creates list of Experiences for specified Resume
router.patch('/resume/:id/:token/createExperiences', createExperiences)

module.exports = router
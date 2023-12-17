const express = require('express')
const {
    getExperiences,
    getExperienceById,
    createExperience,
    deleteExperience,
    updateExperience
} = require('../controllers/experienceController')

const router = express.Router()

// GET all Experiences
router.get('', getExperiences)

// GET an Experience by id
router.get('/id/:id', getExperienceById)

// POST a new Experience
router.post('', createExperience)

// DELETE an Experience corresponding to an id
router.delete('/experience/:id/:token', deleteExperience)

// PATCH Experience corresponding to an id
router.patch('/experience/:id/:token', updateExperience)

module.exports = router
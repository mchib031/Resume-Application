const express = require('express')
const {
    getEducations,
    getEducationById,
    createEducation,
    deleteEducation,
    updateEducation
} = require('../controllers/educationController')

const router = express.Router()

// GET all Educations
router.get('', getEducations)

// GET an Education by id
router.get('/id/:id', getEducationById)

// POST a new Education
router.post('', createEducation)

// DELETE an Education corresponding to an id
router.delete('/education/:id/:token', deleteEducation)

// PATCH Education corresponding to an id
router.patch('/education/:id/:token', updateEducation)

module.exports = router
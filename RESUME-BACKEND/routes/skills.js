const express = require('express')
const {
    getSkills,
    getSkillById,
    createSkill,
    deleteSkill,
    updateSkill
} = require('../controllers/skillController')

const router = express.Router()

// GET all Skills
router.get('', getSkills)

// GET a Skill by id
router.get('/id/:id', getSkillById)

// POST a new Skill
router.post('', createSkill)

// DELETE a Skill corresponding to an id
router.delete('/skill/:id/:token', deleteSkill)

// PATCH Skill corresponding to an id
router.patch('/skill/:id/:token', updateSkill)

module.exports = router
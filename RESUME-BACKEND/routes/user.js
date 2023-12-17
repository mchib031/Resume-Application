const express = require('express')
const {
    getUsers,
    getUserById,
    login,
    logout,
    createUser,
    deleteUser,
    updateUser
} = require('../controllers/userController')

const router = express.Router()

// GET all Users
router.get('/', getUsers) 

// attempt to login
router.post('/login', login)

// attempt to invalidate session token
router.post('/logout', logout)

// GET User info
router.get('/user/:token', getUserById)

// POST a new User
router.post('', createUser)

// DELETE a User corresponding to id
router.delete('/user/:token', deleteUser)

// PATCH User corresponding to id
router.patch('/user/:token', updateUser)

module.exports = router
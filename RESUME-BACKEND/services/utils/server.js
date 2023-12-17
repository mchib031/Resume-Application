const express = require('express')
const cors = require('cors')

const userRoutes = require('../../routes/users')
const educationRoutes = require('../../routes/educations')
const skillRoutes = require('../../routes/skills')
const experienceRoutes = require('../../routes/experiences')
const resumeRoutes = require('../../routes/resumes')

const createServer = () => {
    const app = express()

    app.use(express.json())

    app.use(cors({
        origin: '*'
    }))

    app.use((req, res, next) => {
        console.log(req.path, req.method)
        next()
    })

    app.use('/api/users', userRoutes)
    app.use('/api/educations', educationRoutes)
    app.use('/api/skills', skillRoutes)
    app.use('/api/experiences', experienceRoutes)
    app.use('/api/resumes', resumeRoutes)

    return app
}

module.exports = { createServer }
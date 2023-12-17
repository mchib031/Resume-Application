const Experience = require('../models/ExperienceModel')
const User = require('../models/UserModel')
const Resume = require('../models/ResumeModel')

const {
    authWithToken
} = require('../services/utils/auth')

const {
    validateRequestBody
} = require('../services/utils/validation')

const {
    validateTimeRange
} = require('../services/modelValidation/ExperienceValidation')

const getExperiences = async (req, res) => {
    try {
        return await Experience.find({}).sort({ createdAt: -1 }).then(experiences => {
            return res.status(200).json(experiences)
        })
    }
    catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getExperienceByResume = async (req, res) => {
    try {
        const { id } = req.params

        return await Experience.find({ resume: id }).then(experiences => {
            return res.status(200).json(experiences)
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getExperienceById = async (req, res) => {
    try {
        const { id } = req.params

        return await Experience.findById(id).then(experience => {
            return res.status(200).json(experience)
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getExperienceByCompany = async (req, res) => {
    try {
        const { company } = req.params

        return await Experience.find({ company }).then(experiences => {
            return res.status(200).json({ length: (experiences ? experiences.length : 0), experiences: experiences })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getExperienceByPosition = async (req, res) => {
    try {
        const { position } = req.params

        return await Experience.find({ position }).then(experiences => {
            return res.status(200).json({ length: (experiences ? experiences.length : 0), experiences: experiences })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const createExperience = async (req, res) => {
    try {
        const restrictedKeys = []
        const { token } = req.body
        const { resumeid } = req.body

        var params = {
            ...req.body,
        }

        delete params.token
        delete params.resumeid

        params.resume = resumeid

        validateRequestBody(Experience.schema.paths, params, restrictedKeys)

        var resume = await Resume.findById(resumeid)

        if (!resume)
            throw new Error('Resume does not exist')

        if (resume.owner) {
            if (!token)
                throw new Error('Token not provided')

            var len = token.length,
                middle = Math.floor(len / 2)

            var userid = token.substr(middle)

            await authWithToken(token).then(async valid => {
                if (!valid)
                    throw new Error('Invalid token')

                var user = await User.findById(userid)

                if (!user._id.equals(resume.owner))
                    throw new Error('User does not have permission to update this Resume')
            })
        }

        return await Experience.create(params).then(async experience => {
            resume.experiences.push(experience._id)

            await resume.save()

            return res.status(200).json({ experience: experience, resume: resume, msg: 'Experience successfully created' })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const deleteExperience = async (req, res) => {
    try {
        const { token } = req.params
        const { id } = req.params

        return await authWithToken(token).then(async valid => {
            if (!valid)
                throw new Error('Invalid token')

            var len = token.length,
                middle = Math.floor(len / 2)

            var userid = token.substr(middle)
            var experience = await Experience.findById(id)

            if (!experience)
                throw new Error('Experience does not exist')

            var resume = await Resume.findById(experience.resume)

            if (resume.owner) {
                var user = await User.findById(userid)

                if (!user._id.equals(resume.owner))
                    throw new Error('User does not have permission to delete this Experience')
            }

            resume.experiences = resume.experiences.filter(id => !id.equals(experience._id))

            await resume.save()
            await Experience.findOneAndDelete({ _id: experience._id })

            return res.status(200).json({ msg: 'Experience has been deleted' })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const updateExperience = async (req, res) => {
    try {
        const restrictedKeys = ['resume']
        const { token } = req.params
        const { id } = req.params

        const params = {
            ...req.body
        }

        validateRequestBody(Experience.schema.paths, params, restrictedKeys)

        return await authWithToken(token).then(async valid => {
            if (!valid)
                throw new Error('Invalid token')

            var len = token.length,
                middle = Math.floor(len / 2)

            var userid = token.substr(middle)
            var experience = await Experience.findById(id)

            if (!experience)
                throw new Error('Experience does not exist')

            var resume = await Resume.findById(experience.resume)
            
            if (resume.owner) {
                var user = await User.findById(userid)

                if (!user._id.equals(resume.owner))
                    throw new Error('User does not have permission to update this Experience')
            }

            return await Experience.findByIdAndUpdate(id, params, { runValidators: true, new: true }).then(experience => {
                return res.status(200).json({ experience: experience, msg: 'Experience has been updated' })
            })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

module.exports = {
    getExperiences,
    getExperienceByResume,
    getExperienceById,
    getExperienceByPosition,
    getExperienceByCompany,
    createExperience,
    deleteExperience,
    updateExperience
}
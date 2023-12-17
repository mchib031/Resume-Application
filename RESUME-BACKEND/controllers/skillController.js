const Skill = require('../models/SkillModel')
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
} = require('../services/modelValidation/SkillValidation')

const getSkills = async (req, res) => {
    try {
        return await Skill.find({}).sort({ createdAt: -1 }).then(skills => {
            return res.status(200).json(skills)
        })
    }
    catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getSkillByResume = async (req, res) => {
    try {
        const { id } = req.params

        return await Skill.find({ resume: id }).then(skills => {
            return res.status(200).json(skills)
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getSkillById = async (req, res) => {
    try {
        const { id } = req.params

        return await Skill.findById(id).then(skill => {
            return res.status(200).json(skill)
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getSkillByProficiency = async (req, res) => {
    try {
        const { proficiency } = req.params

        return await Skill.find({ proficiency }).then(skills => {
            return res.status(200).json({ length: (skills ? skills.length : 0), skills: skills })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getSkillByName = async (req, res) => {
    try {
        const { name } = req.params

        return await Skill.find({ name }).then(skills => {
            return res.status(200).json({ length: (skills ? skills.length : 0), skills: skills })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const createSkill = async (req, res) => {
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

        validateRequestBody(Skill.schema.paths, params, restrictedKeys)

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

        return await Skill.create(params).then(async skill => {
            resume.skills.push(skill._id)

            await resume.save()

            return res.status(200).json({ skill: skill, resume: resume, msg: 'Skill successfully created' })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const deleteSkill = async (req, res) => {
    try {
        const { token } = req.params
        const { id } = req.params

        return await authWithToken(token).then(async valid => {
            if (!valid)
                throw new Error('Invalid token')

            var len = token.length,
                middle = Math.floor(len / 2)

            var userid = token.substr(middle)
            var skill = await Skill.findById(id)

            if (!skill)
                throw new Error('Skill does not exist')

            var resume = await Resume.findById(skill.resume)

            if (resume.owner) {
                var user = await User.findById(userid)

                if (!user._id.equals(resume.owner))
                    throw new Error('User does not have permission to delete this Skill')
            }

            resume.skills = resume.skills.filter(id => !id.equals(skill._id))

            await resume.save()
            await Skill.findOneAndDelete({ _id: skill._id })

            return res.status(200).json({ msg: 'Skill has been deleted' })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const updateSkill = async (req, res) => {
    try {
        const restrictedKeys = ['resume']
        const { token } = req.params
        const { id } = req.params

        const params = {
            ...req.body
        }

        validateRequestBody(Skill.schema.paths, params, restrictedKeys)

        return await authWithToken(token).then(async valid => {
            if (!valid)
                throw new Error('Invalid token')

            var len = token.length,
                middle = Math.floor(len / 2)

            var userid = token.substr(middle)
            var skill = await Skill.findById(id)

            if (!skill)
                throw new Error('Skill does not exist')

            var resume = await Resume.findById(skill.resume)
            
            if (resume.owner) {
                var user = await User.findById(userid)

                if (!user._id.equals(resume.owner))
                    throw new Error('User does not have permission to update this Skill')
            }

            return await Skill.findByIdAndUpdate(id, params, { runValidators: true, new: true }).then(skill => {
                return res.status(200).json({ skill: skill, msg: 'Skill has been updated' })
            })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

module.exports = {
    getSkills,
    getSkillByResume,
    getSkillById,
    getSkillByProficiency,
    getSkillByName,
    createSkill,
    deleteSkill,
    updateSkill
}
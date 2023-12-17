const mongoose = require('mongoose')

const Resume = require('../models/ResumeModel')
const User = require('../models/UserModel')
const Skill = require('../models/SkillModel')
const Education = require('../models/EducationModel')
const Experience = require('../models/ExperienceModel')

const {
    authWithToken
} = require('../services/utils/auth')

const {
    validateRequestBody
} = require('../services/utils/validation')

const {
    updateOwnerHelper
} = require('../services/modelHelpers/ResumeHelperService')

const getResumes = async (req, res) => {
    try {
        return await Resume.find({}).sort({ createdAt: -1 }).then(resumes => {
            return res.status(200).json(resumes)
        })
    } catch (err) {
        console.error(err)

        return res.status(400).json({ error: err.message })
    }
}

const getResumeById = async (req, res) => {
    try {
        const { id } = req.params

        return await Resume.findById(id).then(async resume => {
            if (!resume)
                throw new Error('Resume does not exist')

            return res.status(200).json(subscribedResume)
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getResumeByUserOwns = async (req, res) => {
    try {
        const { token } = req.params
        const publicProperties = ['_id', 'owner', 'description']

        return await authWithToken(token).then(async valid => {
            if (!valid)
                throw new Error('Invalid token')

            var len = token.length,
                middle = Math.floor(len / 2)
    
            var userid = token.substr(middle)
            var user = await User.findById(userid)

            return await Resume.find({ owner: user._id }).then(resumes => {
                resumes = resumes.map((resume) => {
                    const filtered = Object.keys(resume.toJSON())
                        .filter(key => publicProperties.includes(key))
                        .reduce((obj, key) => {
                            obj[key] = resume[key]

                            return obj
                        }, {})

                    return filtered
                })

                return res.status(200).json({ length: (resumes ? resumes.length : 0), resumes: resumes })
            })
        })

    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const createResume = async (req, res) => {
    try {
        const restrictedKeys = ['owner']
        var { token } = req.body

        var params = {
            ...req.body,
        }

        delete params.token

        validateRequestBody(Resume.schema.paths, params, restrictedKeys)
            if (!token)
            return await Resume.create(params).then(resume => {
                return res.status(200).json({ resume: resume, msg: 'Resume successfully created' })
            })

        return await authWithToken(token).then(async valid => {
            if (!valid)
                return res.status(400).json({ error: 'Invalid token' })

            var len = token.length,
                middle = Math.floor(len / 2)
    
            var userid = token.substr(middle)
            var user = await User.findById(userid)

            params.owner = user._id

            return await Resume.create(params).then(async resume => {
                user.owns.push(resume.id)

                await user.save()

                return res.status(200).json({ resume: resume, msg: 'Resume successfully created' })
            })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const deleteResume = async (req, res) => {
    try {
        const { token } = req.params
        const { id } = req.params

        return await authWithToken(token).then(async valid => {
            if (!valid)
                throw new Error('Invalid token')

            var len = token.length,
                middle = Math.floor(len / 2)
    
            var userid = token.substr(middle)
            var user = await User.findById(userid)
            var resume = await Resume.findById(id)

            if (!resume)
                throw new Error('Resume does not exist')

            if (!user._id.equals(resume.owner))
                throw new Error('User does not have permission to delete this Resume')

            for (const userid of resume.subscribedUsers) {
                var curr = await User.findById(userid)

                curr.resumes = curr.resumes.filter(id => !id.equals(resume._id))

                await curr.save()
            }

            user.owns = user.owns.filter(id => !id.equals(resume._id))

            await user.save()
            await Resume.findOneAndDelete({ _id: resume._id })

            return res.status(200).json({ msg: 'Resume has been deleted' })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const updateResume = async (req, res) => {
    try {
        const restrictedKeys = ['skills', 'experiences', 'educations']
        const { token } = req.params
        const { id } = req.params

        var params = {
            ...req.body
        }

        validateRequestBody(Resume.schema.paths, params, restrictedKeys)

        var resume = await Resume.findById(id)

        if (!resume)
            throw new Error('Resume does not exist')

        if (resume.owner) {
            await authWithToken(token).then(async valid => {
                if (!valid)
                    throw new Error('Invalid token')

                var len = token.length,
                    middle = Math.floor(len / 2)
    
                var userid = token.substr(middle)
                var user = await User.findById(userid)

                if (!user._id.equals(resume.owner))
                    throw new Error('User does not have permission to update this Resume')

                if (params.owner)
                    await updateOwnerHelper(user._id, params.owner, resume._id)
            })
        }
        else {
            if (params.owner)
                await updateOwnerHelper(null, params.owner, resume._id)
        }

        return await Resume.findByIdAndUpdate(id, params, { runValidators: true, new: true }).then(resume => {
            return res.status(200).json({ resume: resume, msg: 'Resume has been updated' })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const createSkills = async (req, res) => {
    try {
        const { token } = req.params
        const { id } = req.params
        const { skills } = req.body

        var resume = await Resume.findById(id)

        if (!resume)
            throw new Error('Resume does not exist')

        if (resume.owner) {
            await authWithToken(token).then(async valid => {
                if (!valid)
                    throw new Error('Invalid token')

                var len = token.length,
                    middle = Math.floor(len / 2)
    
                var userid = token.substr(middle)
                var user = await User.findById(userid)

                if (!user._id.equals(resume.owner))
                    throw new Error('User does not have permission to update this Resume')
            })
        }

        for (const skill of skills) {
            await Skill.create({ "resume": id, ...skill }).then(skill => {
                resume.skills.push(skill.id)
            })
        }

        await resume.save()

        return res.status(200).json({ skillsCreated: skills.length, resume: resume, msg: 'Skills successfully created' })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const createEducations = async (req, res) => {
    try {
        const { token } = req.params
        const { id } = req.params
        const { educations } = req.body

        var resume = await Resume.findById(id)

        if (!resume)
            throw new Error('Resume does not exist')

        if (resume.owner) {
            await authWithToken(token).then(async valid => {
                if (!valid)
                    throw new Error('Invalid token')

                var len = token.length,
                    middle = Math.floor(len / 2)
    
                var userid = token.substr(middle)
                var user = await User.findById(userid)

                if (!user._id.equals(resume.owner))
                    throw new Error('User does not have permission to update this Resume')
            })
        }

        for (const education of educations) {
            await Education.create({ "resume": id, ...education }).then(education => {
                resume.educations.push(education.id)
            })
        }

        await resume.save()

        return res.status(200).json({ educationsCreated: educations.length, resume: resume, msg: 'Educations successfully created' })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const createExperiences = async (req, res) => {
    try {
        const { token } = req.params
        const { id } = req.params
        const { experiences } = req.body

        var resume = await Resume.findById(id)

        if (!resume)
            throw new Error('Resume does not exist')

        if (resume.owner) {
            await authWithToken(token).then(async valid => {
                if (!valid)
                    throw new Error('Invalid token')

                var len = token.length,
                    middle = Math.floor(len / 2)
    
                var userid = token.substr(middle)
                var user = await User.findById(userid)

                if (!user._id.equals(resume.owner))
                    throw new Error('User does not have permission to update this Resume')
            })
        }

        for (const experience of experiences) {
            await Experience.create({ "resume": id, ...experience }).then(experience => {
                resume.experiences.push(experience.id)
            })
        }

        await resume.save()

        return res.status(200).json({ experiencesCreated: experiences.length, resume: resume, msg: 'Experiences successfully created' })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

module.exports = {
    getResumes,
    getResumeById,
    getResumeByUserOwns,
    createResume,
    deleteResume,
    updateResume,
    createSkills,
    createEducations,
    createExperiences
}
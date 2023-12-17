const Education = require('../models/EducationModel')
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
} = require('../services/modelValidation/EducationValidation')

const getEducations = async (req, res) => {
    try {
        return await Education.find({}).sort({ createdAt: -1 }).then(educations => {
            return res.status(200).json(educations)
        })
    }
    catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getEducationByResume = async (req, res) => {
    try {
        const { id } = req.params

        return await Education.find({ resume: id }).then(educations => {
            return res.status(200).json(educations)
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getEducationById = async (req, res) => {
    try {
        const { id } = req.params

        return await Education.findById(id).then(education => {
            return res.status(200).json(education)
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getEducationByDegree = async (req, res) => {
    try {
        const { degree } = req.params

        return await Education.find({ degree }).then(educations => {
            return res.status(200).json({ length: (educations ? educations.length : 0), educations: educations })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getEducationBySchool = async (req, res) => {
    try {
        const { school } = req.params

        return await Education.find({ school }).then(educations => {
            return res.status(200).json({ length: (educations ? educations.length : 0), educations: educations })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const createEducation = async (req, res) => {
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

        validateRequestBody(Education.schema.paths, params, restrictedKeys)

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

        return await Education.create(params).then(async education => {
            resume.educations.push(education._id)

            await resume.save()

            return res.status(200).json({ education: education, resume: resume, msg: 'Education successfully created' })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const deleteEducation = async (req, res) => {
    try {
        const { token } = req.params
        const { id } = req.params

        return await authWithToken(token).then(async valid => {
            if (!valid)
                throw new Error('Invalid token')

            var len = token.length,
                middle = Math.floor(len / 2)

            var userid = token.substr(middle)
            var education = await Education.findById(id)

            if (!education)
                throw new Error('Education does not exist')

            var resume = await Resume.findById(education.resume)

            if (resume.owner) {
                var user = await User.findById(userid)

                if (!user._id.equals(resume.owner))
                    throw new Error('User does not have permission to delete this Education')
            }

            resume.educations = resume.educations.filter(id => !id.equals(education._id))

            await resume.save()
            await Education.findOneAndDelete({ _id: education._id })

            return res.status(200).json({ msg: 'Education has been deleted' })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const updateEducation = async (req, res) => {
    try {
        const restrictedKeys = ['resume']
        const { token } = req.params
        const { id } = req.params

        const params = {
            ...req.body
        }

        validateRequestBody(Education.schema.paths, params, restrictedKeys)

        return await authWithToken(token).then(async valid => {
            if (!valid)
                throw new Error('Invalid token')

            var len = token.length,
                middle = Math.floor(len / 2)

            var userid = token.substr(middle)
            var education = await Education.findById(id)

            if (!education)
                throw new Error('Education does not exist')

            var resume = await Resume.findById(education.resume)
            
            if (resume.owner) {
                var user = await User.findById(userid)

                if (!user._id.equals(resume.owner))
                    throw new Error('User does not have permission to update this Education')
            }

            return await Education.findByIdAndUpdate(id, params, { runValidators: true, new: true }).then(education => {
                return res.status(200).json({ education: education, msg: 'Education has been updated' })
            })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

module.exports = {
    getEducations,
    getEducationByResume,
    getEducationById,
    getEducationBySchool,
    getEducationByDegree,
    createEducation,
    deleteEducation,
    updateEducation
}
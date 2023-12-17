const { default: mongoose } = require('mongoose')
const Resume = require('../../models/ResumeModel')

const validateResume = async (id) => {
    try {
        if (!id)
            throw new Error('Resume id not provided')

        return await Resume.findOne({ _id: id }).then(resume => {
            if (!resume)
                throw new Error('Resume does not exist')
    
            return null
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    validateResume
}
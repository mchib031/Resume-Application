const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ResumeSchema = new Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    skills: {
        type: [mongoose.Types.ObjectId],
        ref: 'Skill'
    },
    educations: {
        type: [mongoose.Types.ObjectId],
        ref: 'Education'
    },
    experiences: {
        type: [mongoose.Types.ObjectId],
        ref: 'Experience'
    }
}, {
    timestamps: true
})

var Resume = mongoose.model('Resume', ResumeSchema)

module.exports = Resume
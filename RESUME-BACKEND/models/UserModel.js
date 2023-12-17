const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    resumes: {
        type: [mongoose.Types.ObjectId],
        ref: 'Resume'
    },
    owns: {
        type: [mongoose.Types.ObjectId],
        ref: 'Resume'
    }
}, {
    timestamps: true
})

var User = mongoose.model('User', UserSchema)

module.exports = User
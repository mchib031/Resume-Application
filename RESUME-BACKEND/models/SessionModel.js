const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SessionSchema = new Schema({
    userid: {
        type: mongoose.Types.ObjectId,
        required: true
    }
})

var Session = mongoose.model('Session', SessionSchema)

module.exports = Session
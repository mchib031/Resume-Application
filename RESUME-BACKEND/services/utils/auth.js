const mongoose = require('mongoose')

const User = require('../../models/UserModel')
const Resume = require('../../models/ResumeModel')
const Session = require('../../models/SessionModel')

const {
    filterParameters
} = require('./validation')

const bcrypt = require('bcrypt')

const validateTokenFormat = (token) => {
    try {
        if (!token)
            return false

        if (token.length != 48)
            return false

        if (!mongoose.Types.ObjectId.isValid(token.substr(0, 24)))
            return false

        if (!mongoose.Types.ObjectId.isValid(token.substr(24)))
            return false

        return true
    } catch (err) {
        throw new Error(err.message)
    }
}

const authenticate = async (input, password) => {
    try {
        var query = filterParameters(input)

        return await User.findOne(query).then(async user => {
            if (!user)
                return false

            if (!password)
                return false

            var isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch)
                return false

            return await Session.create({ userid: user._id }).then(session => {
                return session._id + session.userid
            })
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

const invalidateToken = async (token) => {
    try {
        if (!validateTokenFormat(token))
            return false

        var sessionid = token.substr(0, 24),
        userid = token.substr(24)

        return User.findById(userid).then(async user => {
            if (!user)
                return false

            return await Session.findByIdAndDelete(sessionid).then(async session => {
                if (!session)
                    return false

                return true
            })
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

const authWithToken = async (token) => {
    try {
        if (!validateTokenFormat(token))
            return false

        var sessionid = token.substr(0, 24),
            userid = token.substr(24)

        return User.findById(userid).then(async user => {
            if (!user)
                return false

            return await Session.findById(sessionid).then(async session => {
                if (!session)
                    return false

                return true
            })
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

const authResume = async (id) => {
    try {
        if (!id)
            return false

        var resume = await Resume.findById(id)

        if (!resume)
            return false

        return true
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    validateTokenFormat,
    authenticate,
    invalidateToken,
    authWithToken,
    authResume
}
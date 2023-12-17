const User = require('../../models/UserModel')
const bcrypt = require('bcrypt')

const validateEmailFormat = (email) => {
    return email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

const validatePasswordFormat = (password) => {
    return password.match(
        /^.*([0-9].*[A-Z]|[A-Z].*[0-9]).*$/
    ) && password.length >= 6
}

const validateEmail = async (email, required) => {
    try {
        if (!required)
            return null

        if (!email)
            throw new Error('Email is required')

        if (!validateEmailFormat(email))
            throw new Error('Email is not in a valid format')

        return await User.findOne({ email }).then(user => {
            if (user)
                throw new Error('Email is already used')

            return null
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

const validateUsername = async (username, required) => {
    try {
        if (!required)
            return null

        if (!username)
            throw new Error('Username is required')

        return await User.findOne({ username }).then(user => {
            if (user)
                throw new Error('Username is already used')

            return null
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

const validatePassword = (password, required) => {
    try {
        if (!required)
            return null

        if (!password)
            throw new Error('Password is required')

        if (!validatePasswordFormat(password))
            throw new Error('Password must contain an uppercase, number, and be at least 6 characters long')

        return null
    } catch (err) {
        throw new Error(err.message)
    }
}

const validateUserFields = async (input, options) => {
    try {
        await validateEmail(input.email, options.email)
        await validateUsername(input.username, options.username)
        validatePassword(input.password, options.password)
    } catch (err) {
        throw new Error(err.message)
    }
}

const encrypt = async (password) => {
    try {
        return bcrypt.genSalt(10).then(salt => {
            return bcrypt.hash(password, salt)
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    validateEmail,
    validateUsername,
    validatePassword,
    validateUserFields,
    encrypt
}
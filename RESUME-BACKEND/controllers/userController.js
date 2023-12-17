const User = require('../models/UserModel')
const Schedule = require('../models/ResumeModel')

const {
    authenticate,
    invalidateToken,
    authWithToken,
} = require('../services/utils/auth')

const {
    validateRequestBody
} = require('../services/utils/validation')

const {
    validateUserFields,
    encrypt
} = require('../services/modelValidation/UserValidation')

const getUsers = async (req, res) => {
    try {
        return await User.find({}).sort({ createdAt: -1 }).then(users => {
            return res.status(200).json(users)
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const login = async (req, res) => {
    try {
        const { id, username, email, password } = req.body

        return await authenticate({ id, username, email }, password).then(token => {
            return res.status(200).json({ token })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const logout = async (req, res) => {
    try {
        const { token } = req.body

        if (!token)
            throw new Error('Token not provided')

        return await invalidateToken(token).then(response => {
            if (!response)
                throw new Error('Unable to invalidate token')

            return res.status(200).json({ msg: 'Token successfully invalidated' })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const getUserById = async (req, res) => {
    try {
        const { token } = req.params

        const properties = ['email', 'username', 'firstName', 'lastName']

        return await authWithToken(token).then(async valid => {
            if (!valid)
                throw new Error('Invalid token')

            var len = token.length,
                middle = Math.floor(len / 2)
    
            var userid = token.substr(middle)
            var user = await User.findById(userid)

            var returnUser = Object.keys(user.toJSON())
                            .filter(key => properties.includes(key))
                            .reduce((obj, key) => {
                                obj[key] = user[key]

                                return obj
                            }, {})

            return res.status(200).json(returnUser)
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const createUser = async (req, res) => {
    try {
        const restrictedKeys = ['resumes', 'owns']
        const { email, username, password } = req.body
        var params = {
            ...req.body
        }

        validateRequestBody(User.schema.paths, params, restrictedKeys)

        await validateUserFields({ email, username, password }, { email: true, username: true, password: true })

        params.password = await encrypt(password)

        return await User.create(params).then(_ => {
            return res.status(200).json({ msg: 'User successfully created' })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const { token } = req.params

        return await invalidateToken(token).then(async valid => {
            if (!valid)
                throw new Error('Unable to invalidate token')

            var len = token.length,
                middle = Math.floor(len / 2)
    
            var userid = token.substr(middle)
            var user = await User.findById(userid)

            for (const scheduleid of user.owns) {
                (await Schedule.updateOne({ _id: scheduleid }, { owner: null }))
            }

            for (const scheduleid of user.schedules) {
                var schedule = await Schedule.findById(scheduleid)

                schedule.subscribedUsers = schedule.subscribedUsers.filter(id => !id.equals(user._id))

                await schedule.save()
            }

            await User.findOneAndDelete({ _id: userid })

            return res.status(200).json({ msg: 'User has been deleted' })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

const updateUser = async (req, res) => {
    try {
        const restrictedKeys = ['resumes', 'owns']
        const { token } = req.params
        const { email, username, password } = req.body
        const params = {
            ...req.body
        }

        validateRequestBody(User.schema.paths, params, restrictedKeys)

        await validateUserFields({ email, username, password }, { email: email, username: username, password: password })

        return await authWithToken(token).then(async valid => {
            if (!valid)
                throw new Error('Invalid token')

            var len = token.length,
                middle = Math.floor(len / 2)
    
            var userid = token.substr(middle)
    
            if (params.password)
                params.password = await encrypt(params.password)

            User.findByIdAndUpdate(userid, params, { runValidators: true, new: true }).then(user => {
                return res.status(200).json({ msg: 'User has been updated' })
            })
        })
    } catch (err) {
        return res.status(400).json({ error: err.message })
    }
}

module.exports = {
    getUsers,
    getUserById,
    login,
    logout,
    createUser,
    deleteUser,
    updateUser
}
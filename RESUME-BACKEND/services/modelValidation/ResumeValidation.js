const User = require('../../models/UserModel')


const validateOwner = async (owner) => {
    try {
        if (owner) {
            await User.findById(owner).then(user => {
                if (!user)
                    throw new Error('User does not exist')
            })
        }
    } catch (err) {
        throw new Error(err.message)
    }
}

const validateResumeFields = async (owner, options) => {
    try {
        await validateOwner(owner, options.owner)
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    validateOwner,
    validateResumeFields
}
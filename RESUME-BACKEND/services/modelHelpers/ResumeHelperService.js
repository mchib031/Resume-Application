const User = require('../../models/UserModel')

const updateOwnerHelper = async (previousOwnerId, newOwnerId, resumeid) => {
    try {
        if (!newOwnerId)
            throw new Error('New owner id not provided')

        var previousOwner = await User.findById(previousOwnerId)
        var newOwner = await User.findById(newOwnerId)

        if (!newOwner)
            throw new Error('New owner does not exist')

        if (previousOwner) {
            previousOwner.owns = previousOwner.owns.filter(id => !id.equals(resumeid))

            await previousOwner.save()
        }

        newOwner.owns.push(resumeid)

        await newOwner.save()
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    updateOwnerHelper
}
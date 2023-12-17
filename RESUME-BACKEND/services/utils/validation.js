const MONGOOSE_IMMUTABLE_FIELDS = ['_id', 'createdAt', 'updatedAt', '__v']

const filterParameters = (input) => {
    try {
        var filteredInput = Object.entries(input).filter(v => v[1])
        var fields = Object.entries(input).map(v => v[0]).join(', ')

        if (!filteredInput.length)
            throw new Error(`No valid parameter provided`)

        if (filteredInput.length > 1)
            throw new Error(`Only provide one of ${ fields }`)

        var [ k, v ] = filteredInput[0]
        var query = {}

        if (k == "id")
            query[`_${ k }`] = v
        else
            query[k] = v

        return query
    } catch (err) {
        throw new Error(err.message)
    }
}

const validateRequestBody = (paths, input, restricted) => {
    try {
        var valid = Object.keys(paths).filter(key => !MONGOOSE_IMMUTABLE_FIELDS.includes(key))
    
        restricted.forEach(key => {
            var indexOf = valid.indexOf(key)
    
            if (indexOf != -1)
                valid.splice(indexOf, 1)
        })
    
        Object.keys(input).forEach(key => {
            if (!valid.includes(key))
                throw new Error(`${ key } is an invalid field`)
        })
    
        return null
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    filterParameters,
    validateRequestBody
}
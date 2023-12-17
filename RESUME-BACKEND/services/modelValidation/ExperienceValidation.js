const { default: mongoose } = require('mongoose')
const Resume = require('../../models/ResumeModel')

const checkTimeAfterCurrent = (time) => {
    if (time < new Date())
        throw new Error('Time is before current time')
}

const validateTimeRange = (start, end, required) => {
    try {
        if (!required)
            return null

        if (start) {
            checkTimeAfterCurrent(start)

            if (end) {
                checkTimeAfterCurrent(end)

                if (start == end)
                    throw new Error('Start date is same as End date')
                else if (start > end)
                    throw new Error('Start date of Event is after End date')
            }
            else {
                if (required.end)
                    throw new Error('End date not provided')
            }
        }
        else {
            if (required.start)
                throw new Error('Start date not provided')

            if (end) {
                checkTimeAfterCurrent(end)
            }
            else {
                if (required.end)
                    throw new Error('End date not provided')
            }
        }
    } catch (err) {
        throw new Error(err.message)
    }
}

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

const validateExperienceFields = async (resumeid, start, end, options) => {
    try {
        await validateSchedule(resumeid).then(_ => {
            validateTimeRange(start, end, options.timeRange)
        })
    } catch (err) {
        throw new Error(err.message)
    }
}

module.exports = {
    validateTimeRange,
    validateResume,
    validateExperienceFields
}
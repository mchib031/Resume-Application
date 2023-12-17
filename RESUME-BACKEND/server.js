require('dotenv').config()

const mongoose = require('mongoose')
const { createServer } = require('./services/utils/server')

const app = createServer()

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`connected to database & listening on port ${ process.env.PORT }`)
        })
    })
    .catch(err => {
        console.log(err)
})

module.exports = app
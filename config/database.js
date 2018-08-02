/**
 * Database configuration
 */

'use strict'

const mongoose = require('mongoose'),
    env = require('../env'),
    db_url = process.env.MONGO_URI ? process.env.MONGO_URI :  env.settings.MONGO_URI

mongoose.connect(db_url)

mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection connected')
})

mongoose.connection.on('error', (err) => {
    console.log('Mongoose default connection error: ' + err)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection disconnected.')
})

mongoose.connection.on('open', () => {
    console.log('Mongoose default connection is open.')
})

process.on('SIGINT', () => {
    mongoose.connection.close(() => {
        console.log('Mongoose default connection disconnected through app termination.')
        process.exit(0)
    })
})

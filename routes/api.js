const express = require('express'),
    app = express()

app.use('/users', require('../modules/Users'))

module.exports = app

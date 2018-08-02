const express = require('express'),
    app = express()

app.use('/users', require('../modules/Users'))
app.use('/contacts', require('../modules/Contacts'))

module.exports = app

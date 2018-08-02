'use strict';

const router = require('express').Router(),
    Actions = require('./actions')

router.get('/', Actions.doGet)

module.exports = router
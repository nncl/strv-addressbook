'use strict';

const router = require('express').Router(),
    Actions = require('./actions')

router.post('/', Actions.doCreate)

module.exports = router
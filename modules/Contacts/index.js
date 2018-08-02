'use strict';

const router = require('express').Router(),
    Actions = require('./actions'),
    auth = require('../Auth')

router.use('', auth)
router.post('/', Actions.doCreate)

module.exports = router
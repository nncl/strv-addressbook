'use strict';

const router = require('express').Router(),
    Actions = require('./actions'),
    auth = require('../Auth')

router.post('/', Actions.doCreate)
router.post('/auth', Actions.doAuthentication)

module.exports = router
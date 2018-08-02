'use strict';

const router = require('express').Router(),
    Actions = require('./actions')

router.post('/', Actions.doCreate)
router.post('/auth', Actions.doAuthentication)

module.exports = router
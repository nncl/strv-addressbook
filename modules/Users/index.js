'use strict';

const router = require('express').Router(),
    Actions = require('./actions'),
    auth = require('../Auth')

router.post('/', Actions.doCreate)
router.post('/auth', Actions.doAuthentication)
router.get('/', auth, Actions.doList)
router.put('/:id', auth, Actions.doUpdate)

module.exports = router
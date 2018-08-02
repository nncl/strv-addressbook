'use strict';

const UserOrganism = require('../organisms/organism-user')

/**
 * @description
 * General callback
 *
 * @param {Object | String | Number | Boolean} err
 * @param {Object | String | Number} data
 * @param {Object} res
 * @returns {*}
 */

const callback = (err, data, res) => {
    if (err) return res.status(400).json({success: false, message: err});
    res.json({success: true, data});
}


/**
 * @description
 * User's Actions
 * @type {{}}
 */

const Actions = {};

Actions.doCreate = (req, res) => {

    /**
     * Validate required fields
     */

    req.checkBody('email', 'Please add a valid email address').isEmail();
    req.checkBody('password', 'Password is required')
        .notEmpty()
        .hasMinLength()
        .withMessage('Password must have at least 6 characters');

    const errors = req.validationErrors();
    if (errors) return callback(errors, null, res)

    const user = new UserOrganism(req.body),
        log = require('../../Log').logger(`${user.email}.log`)

    user.save((err, doc) => {
        log.info('Response for account creation', err, doc)

        if (err) return callback('Error creating user. Please check the logs.', null, res)
        callback(null, {message: 'User created successfully'}, res)
    })

};

module.exports = Actions;

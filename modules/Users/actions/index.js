'use strict';

const jwt = require('jsonwebtoken'),
    UserOrganism = require('../organisms/organism-user')

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

Actions.doAuthentication = (req, res) => {

    /**
     * Validate required fields
     */

    req.checkBody('email', 'E-mail address is required')
        .notEmpty()
        .isEmail()
        .withMessage('Please add a valid email address');
    req.checkBody('password', 'Password is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) return callback(errors, null, res)

    const log = require('../../Log').logger(`${req.body.email}.log`)
    let query = {email: req.body.email}

    UserOrganism
        .findOne(query, (err, doc) => {
            log.info('Response for account finding', doc, err)

            if (err) return callback('Error finding user. Please check the logs.', null, res)
            if (!doc) return callback('User not found', null, res)

            // Let's compare the passwords
            doc.comparePassword(req.body.password, (err, isMatch) => {
                log.info('Response for compare passwords', err, isMatch)

                if (!err && isMatch) {

                    const expiresIn = process.env.EXPIRES_IN ? process.env.EXPIRES_IN : require('../../../env').settings.EXPIRES_IN,
                        secret = process.env.SECRET ? process.env.SECRET : require('../../../env').settings.SECRET

                    const token = jwt.sign({doc}, secret, {
                        expiresIn: expiresIn
                    });

                    doc = doc.toObject() // We have to parse it otherwise wouldn't be possible to add the token to the same object
                    doc.token = token

                    callback(null, doc, res)

                } else {
                    return callback('E-mail address or password is incorrect', null, res)
                }
            })
        })

};

module.exports = Actions;

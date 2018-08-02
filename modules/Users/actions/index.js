'use strict';

const jwt = require('jsonwebtoken'),
    UserOrganism = require('../organisms/organism-user'),
    bcrypt = require('bcrypt')

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

/**
 * @description
 * Authenticate a user returning his info and a valid token
 *
 * @param req
 * @param res
 * @returns {*}
 */

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

                    const expiresIn = process.env.EXPIRES_IN || require('../../../env').settings.EXPIRES_IN,
                        secret = process.env.SECRET || require('../../../env').settings.SECRET

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

/**
 * @description
 * List users with pagination options.
 *
 * @param req
 * @param res
 */

Actions.doList = (req, res) => {
    const options = {
        select: '_id email',
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 10
    }

    UserOrganism.paginate({}, options, (err, docs) => {
        if (err) return callback('Error listing documents.', null, res)
        callback(null, docs, res)
    })
}

/**
 * @description
 * List user by ID. Note that the result is not an array anymore.
 *
 * @param req
 * @param res
 */

Actions.doListById = (req, res) => {
    UserOrganism.findOne({_id: req.params.id}, (err, doc) => {
        if (err) return callback('Error listing document.', null, res)
        if (!doc) return callback('User not found', null, res)
        callback(null, doc, res)
    })
}

/**
 * @description
 * Simply update a user information. Note that password is not required, but when required
 * the same rules are applied.
 *
 * For now every user with a valid token can update a document. If required, the best thing to do here is implement either a new auth middleware
 * or something such as ACL rules.
 *
 * @param req
 * @param res
 * @returns {*}
 */

Actions.doUpdate = (req, res) => {

    /**
     * Validate required fields
     */

    req.checkBody('email', 'Please add a valid email address').isEmail();

    const errors = req.validationErrors();
    if (errors) return callback(errors, null, res)

    const query = {_id: req.params.id},
        log = require('../../Log').logger(`${req.body.email}.log`),
        update = {
            $set: {
                updated_at: Date.now(),
                email: req.body.email
            }
        }

    // If has password, as long is not required, we must encrypt it
    if (req.body.password) {
        if (req.body.password.length < 6) return callback('Password must have at least 6 characters', null, res)
        update.$set.password = bcrypt.hashSync(req.body.password, 10);
    }

    UserOrganism.update(query, update, (err, doc) => {
        log.info('Response for account update', err, doc)

        if (err) return callback('Error updating document. Please check the logs.', null, res)
        callback(null, {message: 'User updated successfully'}, res)
    })
}

/**
 * @description
 * Delete user by ID.
 * For now every user with a valid token can delete a document. If required, the best thing to do here is implement either a new auth middleware
 * or something such as ACL rules.
 *
 * @param req
 * @param res
 */

Actions.doDelete = (req, res) => {

    const query = {_id: req.params.id},
        log = require('../../Log').logger(`${req.body.email}.log`)

    UserOrganism.remove(query, (err, doc) => {
        log.info('Response for account delete', err, doc)

        if (err) return callback('Error deleting document. Please check the logs.', null, res)
        callback(null, {message: 'User deleted successfully'}, res)
    })
}

module.exports = Actions;

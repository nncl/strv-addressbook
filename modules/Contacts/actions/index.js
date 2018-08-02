'use strict';

const firebase = require('firebase'),
    serviceAccount = require('../../../config/strv-address-book-3289f-firebase-adminsdk-lgo9v-0097bd9bd1.json'),
    app = firebase.initializeApp({
        databaseURL: process.env.FIREBASE_DATABASE_URI || require('../../../env').settings.FIREBASE_DATABASE_URI,
        serviceAccount: serviceAccount
    });

/**
 * @description
 * General callback
 *
 * @param {Object | String | Number | Boolean} err
 * @param {Object | String | Number} data
 * @param {Object} res
 * @param {Number} statusCode Not required
 * @returns {*}
 */

const callback = (err, data, res, statusCode) => {
    if (err) return res.status(statusCode || 400).json({success: false, message: err});
    res.json({success: true, data});
}

/**
 * @description
 * User's Actions
 * @type {{}}
 */

const Actions = {}

Actions.doCreate = (req, res) => {

    /**
     * Validate required fields
     */

    req.checkBody('firstName', 'First name is required')
        .notEmpty()

    req.checkBody('email', 'E-mail address is required')
        .notEmpty()
        .isEmail()
        .withMessage('Please add a valid email address')

    req.checkBody('mobilenumber', 'Mobile phone number is required')
        .notEmpty()
        .isMobilePhone('any')
        .withMessage('Please add a valid phone number')

    const errors = req.validationErrors();
    if (errors) return callback(errors, null, res, 422)

    app.database().ref('/contacts').push(req.body).then(() => {
        return callback(null, {message: 'Contact created successfully'}, res)
    })

}

module.exports = Actions;

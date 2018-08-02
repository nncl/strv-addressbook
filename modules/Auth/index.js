'use strict'

/**
 * @description
 * Every route that implements this route will be denied in case the token is invalid.
 */

const express = require('express'),
    authRoutes = express.Router(),
    jwt = require('jsonwebtoken')

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
    if (err) return res.status(401).json({success: false, message: err});
    res.json({success: true, data});
}

authRoutes.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['authorization'];

    if (token) {

        const secret = process.env.SECRET || require('../../env').settings.SECRET

        jwt.verify(token, secret, (err, decoded) => {
            if (err) return callback('Error verifying token', null, res)
            req.decoded = decoded
            next()
        })

    } else {
        callback('Invalid token', null, res)
    }
});

module.exports = authRoutes;
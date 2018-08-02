'use strict';

/**
 * @description
 * User's Actions
 */

const callback = (err, data, res) => {
    if (err) return res.status(400).json({success: false, message: err});
    res.json({success: true, data});
}

const Actions = {};

Actions.doGet = (req, res) => callback(false, {message: 'Hello users'}, res);

module.exports = Actions;

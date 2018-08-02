'use strict'

/**
 * @description
 * Responsible module for creating log files
 */

const winston = require('winston')
    , log = {

    logger: (name) => {

        return winston.createLogger({
            transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({filename: 'logs/' + name, json: true})
            ]
        })

    }

}

module.exports = log;
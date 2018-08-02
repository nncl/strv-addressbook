'use strict'

/**
 * @description
 * User's molecule
 */

const mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt = require('bcrypt'),
    paginate = require('mongoose-paginate')

const MoleculeSchema = new Schema({
    email: require('../../atoms/atom-email'),
    password: require('../../atoms/atom-string'),
    created_at: require('../../atoms/atom-date'),
    updated_at: require('../../atoms/atom-date')
})

MoleculeSchema.pre('save', function (next) {
    // Not possible to pass arrow function above, for now, as described on https://github.com/Automattic/mongoose/issues/3619 - TODO Fix this

    let user = this
    if (user.password) {
        if (this.isModified('password') || this.isNew) {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return next(err)

                bcrypt.hash(user.password, salt, (err, hash) => {
                    if (err) return next(err)
                    user.password = hash
                    next()
                })
            })
        } else {
            return next()
        }
    } else {
        return next()
    }
})

MoleculeSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, (err, isMatch) => {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

MoleculeSchema.plugin(paginate)

module.exports = MoleculeSchema

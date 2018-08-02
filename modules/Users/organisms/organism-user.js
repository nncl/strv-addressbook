/**
 * User's organism
 */

const mongoose = require('mongoose')
    , Schema = require('../molecules/molecule-user')
    , Organism = mongoose.model('User', Schema);

module.exports = Organism;

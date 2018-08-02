/**
 * Atom field email
 */

const Atom = {
    type: String,
    unique: true,
    required: true,
    index: true,
    set: require('../quarks/quark-toLower')
}

module.exports = Atom

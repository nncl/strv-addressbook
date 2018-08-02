const express = require('express'),
    router = express.Router(),
    title = process.env.TITLE ? process.env.TITLE : require('../env').settings.TITLE

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {title})
})

module.exports = router

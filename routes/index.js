const express = require('express'),
    router = express.Router(),
    env = process.env.TITLE ? process.env.TITLE : require('../env')

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {title: env.settings ? env.settings.title : env});
});

module.exports = router;

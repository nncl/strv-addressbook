const express = require('express'),
    router = express.Router(),
    env = require('../env')

/* GET home page. */
router.get('/', (req, res, next) => {
    res.render('index', {title: env.settings.title});
});

module.exports = router;

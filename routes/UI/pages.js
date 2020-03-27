var express = require('express')
var moment = require('moment');
var router = express.Router({ mergeParams: true });

router.get('/', function(req, res, next) {
    res.render('pages/main', { title: 'shibainu | subpage', name: req.params.name });
});

module.exports = router
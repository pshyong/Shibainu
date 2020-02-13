var express = require('express');
var router = express.Router({ mergeParams: true, strict: true});

/* Main pages router */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'shibainu', name: req.params.name, category: req.params.cat_name});

});

// This page handler for subpage and category
router.use('/p/:name/?', require('./category'));



module.exports = router;


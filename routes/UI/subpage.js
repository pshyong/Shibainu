var express = require('express')
var moment = require('moment');
var router = express.Router({ mergeParams: true });

router.get('/', function(req, res, next) {
    res.render('pages/subpage', { title: 'shibainu | subpage', name: req.params.name });
});

router.route('/c/:cat_name/')
    .get(function(req, res) {
      res.render('pages/category', { title: 'shibainu | subpage', name: req.params.name, category: req.params.cat_name, moment: moment});
});

router.route('/c/:cat_name/post-thread')
    .get(function(req, res) {
        res.render('pages/newthread', { title: 'shibainu | subpage', name: req.params.name, category: req.params.cat_name, moment: moment});
});

router.route('/c/:cat_name/threads/:thread_name/:thread_id/?')
    .get(function(req, res) {
        res.render('pages/threads', { title: 'shibainu | thread', thread_id: req.params.thread_id, name: req.params.name, category: req.params.cat_name, moment: moment});
});


module.exports = router
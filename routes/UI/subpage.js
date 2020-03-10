const express = require('express')
// TODO: Get rid of moment since it wont be needed here anymore, that is when everyone is also done the function as well
const moment = require('moment');
const router = express.Router({ mergeParams: true });
const page = require('./page_func');

router.get('/', page.main_subpage);

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
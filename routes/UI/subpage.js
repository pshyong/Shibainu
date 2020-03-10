const express = require('express')
// TODO: Get rid of moment since it wont be needed here anymore, that is when everyone is also done the function as well
const moment = require('moment');
const router = express.Router({ mergeParams: true, struct: true });
const page = require('./page_func');

router.get('/', page.main_subpage);

router.route('/c/:cat_name/?')
    .get(function(req, res) {
        if (!req.url.endsWith('/')) {
            res.redirect(301, req.originalUrl + '/')
        }
      res.render('pages/category', { title: 'shibainu | subpage', name: req.params.name, category: req.params.cat_name, moment: moment});
});

router.route('/c/:cat_name/post-thread/?')
    .get(function(req, res) {
        if (!req.url.endsWith('/')) {
            res.redirect(301, req.originalUrl + '/')
        }
        res.render('pages/newthread', { title: 'shibainu | subpage', name: req.params.name, category: req.params.cat_name, moment: moment});
});

router.route('/c/:cat_name/threads/:thread_name/?')
    .get(function(req, res) {
        if (!req.url.endsWith('/')) {
            res.redirect(301, req.originalUrl + '/')
        }
        res.render('pages/threads', { title: 'shibainu | subpage', name: req.params.name, category: req.params.cat_name, moment: moment});
});


module.exports = router
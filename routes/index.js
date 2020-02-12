var express = require('express');
var router = express.Router();

const db = require('./queries');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({
    extended: true
})
router.use(jsonParser)

/* Main pages router */
router.get('/', function(req, res, next) {
  res.render('pages/index', { title: 'shibainu' });
});

// This page will need to have paramters too
router.get('/pages', function(req, res, next) {
  res.render('pages/subpage', { title: 'shibainu | subpage' });
});

// ! Try and group the api calls to ones that are similar
// ! All api calls should be going through /api/whatever
/* API routers */
router.post('/api/pages/addPage', db.addPage);
router.get('/api/pages/getPages', db.getPages);

module.exports = router;

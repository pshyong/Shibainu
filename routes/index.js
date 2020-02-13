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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// ! Try and group the api calls to ones that are similar
// ! All api calls should be going through /api/whatever
// API contexts
router.post('/api/pages/addPage', db.addPage);
router.get('/api/pages/getPages', db.getPages);

router.post('/api/pages/addCategory', db.addCategory);
router.get('/api/pages/getCategories', db.getCategories);

router.post('/api/pages/addSubCategory', db.addSubCategory);
router.get('/api/pages/getSubCategories', db.getSubCategories);

router.post('/api/pages/addThread', db.addThread);
router.get('/api/pages/getThreads', db.getThreads);

router.post('/api/pages/addPost', db.addPost);
router.get('/api/pages/getPosts', db.getPosts);


module.exports = router;


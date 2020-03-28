var express = require('express');
var router = express.Router({ mergeParams: true, strict: true});
const page = require('./UI/page_func');

/* Main pages router */
router.get('/', page.main_page); 

// This page handler for subpage and category
router.use('/p/:name/?', require('./UI/subpage'));



module.exports = router;


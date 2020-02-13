var express = require('express');
var router = express.Router({ mergeParams: true, strict: true});
// const category = require('express').Router({ mergeParams: true });

const db = require('./queries');
const bodyParser = require('body-parser');

// ! Try and group the api calls to ones that are similar
// ! All api calls should be going through /api/whatever
/* API routers */
/**
 * @swagger
 *
 * /login:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */
router.post('/pages/addPage', db.addPage);
router.get('/pages/getPages', db.getPages);

router.post('/pages/addCategory', db.addCategory);
router.get('/pages/getCategories', db.getCategories);

router.post('/pages/addSubCategory', db.addSubCategory);
router.get('/pages/getSubCategories', db.getSubCategories);

router.post('/api/pages/addThread', db.addThread);
router.get('/api/pages/getThreads', db.getThreads);

router.post('/api/pages/addPost', db.addPost);
router.get('/api/pages/getPosts', db.getPosts);

module.exports = router;
// ! Please follow these for developing your api
// ! https://florimond.dev/blog/articles/2018/08/restful-api-design-13-best-practices-to-make-your-users-happy/

// Constants that we should be using to grab both our configuration
// and express sanitization/validator
const db = require('../config')
const express = require('express')

const {
    body,
    validationResult
} = require('express-validator');

const addPageQuery = "INSERT INTO subpage(title) VALUES ($1) RETURNING title, page_id";
const getPagesQuery = "SELECT * FROM subpage;";

const addCategoryQuery = "INSERT INTO category(subject, user_account_id, last_posted_by, page_id) VALUES ($1, $2, $3, $4) RETURNING subject, cat_id;";
const getCategoryQuery = "SELECT * FROM category WHERE page_id = $1;";
const addThreadQuery = "INSERT INTO tread(title) tread(cat_id) VALUES ($1) ($2) RETURNING title, page_id";
const getThreadQuery = "SELECT * FROM thread;";

const addPostQuery = "INSERT INTO post(title) post(content) post(thread_id) VALUES ($1) ($2) ($3) RETURNING title, page_id";
const getPostQuery = "SELECT * FROM post;";

function sendJSON(statusCode, payload) {
    return JSON.stringify({status_code: statusCode, payload: payload})
}

function sendError(statusCode, message, additionalInfo={}) {
    return JSON.stringify({status_code:statusCode, error: {message: message, additional_information: additionalInfo}})
}

exports.addPage = [
	// We first want to verify expected parameters and escape any special characters
	body('title').exists().withMessage("Missing Title Parameter").bail()
	  .matches(/^[a-zA-Z0-9 ]+$/i).withMessage("Invalid Title Parameter").bail().escape(),
	// As we get more fields to add, you must keep adding on to this
	// refer to express-validator if you're unsure what to do here
	// Removed sanitize body, since it will now be deprecated
	// You can do more checking by express-validator's sanitization middlewares

	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		// use db.task(async t => {}) to create the promise
		db.task(async t => { // do actual db calls in async t => {}
			// wait for db to give results back
			const result = await t.one(addPageQuery, [req.body.title]);
			
			// return results to be used in the 'then' call
			return result;
		}).then (result => {
			// Since we are returning title back from the query, we will get a response back if successful
			// Therefore we will want to use those feedback to check if query succeeded or failed
			// So now we will want to get things back
			if ("title" in result) {
				// We want to send back 200 for successful query
				// I am sending back a response just for debugging to see if api actually worked and inserted
				res.status(200).send(`Subpage inserted with title: "${result.title}" and page_id: ${result.page_id}`); 
			} else {
				// The case where it didnt actually insert correctly
				res.status(400).send("Unable to insert the subpage");
			}
		})
		// We want to catch any exception else your program will crash :) have fun with that 
		.catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

exports.getPages = function (request, response) {
	db.task(async t => {
		const result = await t.any(getPagesQuery);
		return result;
	}).then (result => {
		// pg-promise already formates the result as a JSON so just send it back
		response.status(200).json(result)
	}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
}

exports.addCategory = [
	body('subject').exists().withMessage("Missing Subject Parameter").bail()
	  .matches(/^[a-zA-Z0-9 ]+$/i).withMessage("Invalid Title Parameter").bail().escape(),
	body('user_account_id').exists().withMessage("Missing User Id Parameter").bail()
	  .isInt().withMessage("Invalid User Id Parameter").bail().escape(),
	body('page_id').exists().withMessage("Missing Page Id Parameter").bail()
	  .isInt().withMessage("Invalid Page Id Parameter").bail().escape(),
	async function (req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {

exports.addThread = [
	body('title').exists().withMessage("Missing Title Parameter").bail()
	  .matches(/^[a-zA-Z0-9 ]+$/i).withMessage("Invalid Title Parameter").bail().escape(),
	body('cat_id').exists().withMessage("Missing category Id Parameter").bail()
	  .isInt().withMessage("Invalid category Id Parameter").bail().escape(),



	async function (req, res, next) {
		//see if we have any errors
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// if there are errors, we return 400
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		db.task(async t => {
			const result = await t.one(addCategoryQuery, [req.body.subject, req.body.user_account_id, req.body.user_account_id, req.body.page_id]);
			return result;
		}).then (result => {
			if ("subject" in result) {
				res.status(200).send(`Category inserted with title ${result.subject} and page ${result.cat_id}`);
			} else {
				res.status(400).send("Unable to insert the category");
			}
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

exports.getCategories = [
	body('page_id').exists().withMessage("Missing Page Id Parameter").bail()
	  .isInt().withMessage("Invalid Page Id Parameter").bail().escape(),
	async function (req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		db.task(async t => {
			const result = await t.any(getCategoryQuery, [req.body.page_id]);
			return result;
		}).then (result => {
			res.status(200).json(result)
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];
		//here may be have to check if post is already in db?

		db.task(async t => { //try to add to the db
			const result = await t.one(addThreadQuery, [req.body.title],[req.body.cat_id]);
			return result;
		}).then (result => {

			if ("title" in result) {
				// return 200 if we successfully added the thread
				res.status(200).send(`Thread inserted with title ${result.title} and thread ${result.thread_id}`); 
			} else {
				// return 400 if we unsuccessfully added the thread
				res.status(400).send("Unable to insert the thread");
			}
		})
		// We want to catch any exception else your program will crash :) have fun with that 
		.catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

exports.getThread = function (request, response) {
	db.task(async t => {
		const result = await t.any(getThreadQuery);
		return result;
	}).then (result => {
		response.status(200).json(result)
	}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
}

exports.addPost = [

	//need to check that atleast a title,page id and content exist.
	body('title').exists().withMessage("Missing Title Parameter").bail()
	  .matches(/^[a-zA-Z0-9 ]+$/i).withMessage("Invalid Title Parameter").bail().escape(),
	body('page_id').exists().withMessage("Missing Page Id Parameter").bail()
	  .isInt().withMessage("Invalid Page Id Parameter").bail().escape(),
	body('content').exists().withMessage("Missing content Parameter").bail()
	  .isInt().withMessage("Invalid content Parameter").bail().escape(),


	async function (req, res, next) {
		//see if we have any errors
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// if there are errors, we return 400
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		//here may be have to check if post is already in db?

		db.task(async t => { //try to add to the db
			const result = await t.one(addPostQuery, [req.body.title],[req.body.page_id],[req.body.content]);
			return result;
		}).then (result => {

			if ("title" in result) {
				// return 200 if we successfully added the page
				res.status(200).send(`Page inserted with title ${result.title} and page ${result.page_id}`); 
			} else {
				// return 400 if we unsuccessfully added the page
				res.status(400).send("Unable to insert the page");
			}
		})
		// We want to catch any exception else your program will crash :) have fun with that 
		.catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

exports.getPost = function (request, response) {
	db.task(async t => {
		const result = await t.any(getPostQuery);
		return result;
	}).then (result => {
		response.status(200).json(result)
	}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	
}



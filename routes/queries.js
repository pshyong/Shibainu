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

function sendJSON(statusCode, payload) {
    return JSON.stringify({status_code: statusCode, payload: payload})
}

function sendError(statusCode, message, additionalInfo={}) {
    return JSON.stringify({status_code:statusCode, error: {message: message, additional_information: additionalInfo}})
}

exports.addPage = [
	// We first want to verify such message exists and is a well messaget
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
				console.log(result);
				res.status(200).send(`Post inserted with title ${result.title} and page ${result.page_id}`); 
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
		response.status(200).json(result)
	}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
}

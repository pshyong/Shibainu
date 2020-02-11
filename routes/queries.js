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
const {
    sanitizeBody
} = require('express-validator');


exports.addPage = function (request, response) {
	// We first want to verify such message exists and is a well message
	body('title').notEmpty().isAlphanumeric().withMessage("Missing title response"),
	// As we get more fields to add, you must keep adding on to this
	// refer to express-validator if you're unsure what to do here
	// Next we must sanitize the body to escape all chars that does injections
	sanitizeBody('title').escape(), // You can add more by doing sanitizeBody('a1', 'b').escape()
	
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).send(errors);
			return;
		}
		// We will want to define a local scope variable for this function only
		let title = req.body.title;
		// We need to prepare the statement to also do another level of sanization on the database
		// The following queries should be updated as the database is updated
		let insert_page = `INSERT INTO mainpage(title, cat_ids) VALUES ($1, 0) RETURNING title`;
		// Now we must use promise from javascript to make sure we get a callback
		// You will keep populate this array if you have multiple queries to do in this function
		Promise.all([pool.query(insert_page, [title])])
		.then (result => {
			// Since we are returning title back from the query, we will get a response back if successful
			// Therefore we will want to use those feedback to check if query succeeded or failed
			// So now we will want to get things back
			var rows = result.filter(r=>r.rowCount > 0).map(r => r.rows[0])
			if (rows[0].title) {
				// We want to send back 200 for successful query
				// I am sending back a response just for debugging to see if api actually worked and inserted
				res.status(200).send(`Post inserted with title ${rows[0].title}`); 
			} else {
				// The case where it didnt actually insert correctly
				res.status(400).send(`Unable to insert into the specified field`);
			}
		})
		// We want to catch any exception else your program will crash :) have fun with that 
		.catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + 'error ' + e))})
		
	}
}

exports.getPages = function (request, response) {
	pool.query("SELECT * FROM mainpage;",
		(error, results) => {
			if (error) {	
				console.error(error)
				response.status(500).end()
			}else {
				response.status(200).json(results.rows)
			}
	})
	
}

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
	if (!request.body.hasOwnProperty("title")) {
		console.error("Request body did not have title parameter")
		response.status(400).end()
	} else {
		pool.query("INSERT INTO mainpage(title, cat_ids) VALUES ($1, 0);", [request.body.title], 
				(error, results) => {
					if (error) {
						console.error(error)
						response.status(500).end()
					}else {
						response.status(200).end()
					}
				})
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

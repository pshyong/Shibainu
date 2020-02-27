// ! Please follow these for developing your api
// ! https://florimond.dev/blog/articles/2018/08/restful-api-design-13-best-practices-to-make-your-users-happy/

// Constants that we should be using to grab both our configuration
// and express sanitization/validator
const db = require('../../config')
const express = require('express')

const {
    body,
	param,
	validationResult
} = require('express-validator');
 
function sendJSON(statusCode, payload) {
    return JSON.stringify({status_code: statusCode, payload: payload})
}

function sendError(statusCode, message, additionalInfo={}) {
    return JSON.stringify({status_code:statusCode, error: {message: message, additional_information: additionalInfo}})
}

function runDeleteQuery(selectQuery, deleteQuery, args) {
	return db.task(async t => {
		return await t.any(selectQuery, args)
					  .then(post => {
						  if (post.length == 0) {
								return null;
						  }	else {
							  	return t.result(deleteQuery, args);
					  }}).catch(e => {throw e})				
	})
}

const getPagesQuery = "SELECT * FROM subpage WHERE page_id = $1;";
const addPageQuery = "INSERT INTO subpage(title) VALUES ($1) RETURNING title, page_id";
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

				res.status(200).json(result);
			} else {
				// The case where it didnt actually insert correctly
				res.status(400).send("Unable to insert the subpage");
			}
		})
		// We want to catch any exception else your program will crash :) have fun with that 
		.catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

//const getPagesQuery = "SELECT * FROM subpage WHERE page_id = $1;";
const getPagesCatQuery = "SELECT * FROM category WHERE page_id = $1;";
const getPagesSubCatQuery = "SELECT * FROM subcategory WHERE main_cat_id = $1;";
exports.getPages = [

	param('page_id').exists().withMessage("Missing Page id Parameter").bail()
	  .isInt().withMessage("Invalid Page Id Parameter").bail().escape(),



	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		db.task(async t => {

			const page_d = await t.any(getPagesQuery, [req.params.page_id]);
			const cat_d = await t.any(getPagesCatQuery, [req.params.page_id]);

			var result = {page_d,cat_d,subcat_d:[]}

			//loop through each cat to get their sub cats
			for (const element of cat_d) {
				var temp = await t.any(getPagesSubCatQuery, [element.cat_id]);
				result.subcat_d.push(temp);
		
			}

			return result;

		}).then (result => {
			res.status(200).json(result);
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const getSpecificPageQuery = "SELECT * FROM Subpage WHERE page_id = $1;";
const deletePageQuery = "DELETE FROM Subpage WHERE page_id=$1;";
exports.deletePage= [
	body('page_id').exists().withMessage("Missing Subpage Id Parameter").bail()
	  .isInt().withMessage("Invalid Subpage Id Parameter").bail().escape(),
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		runDeleteQuery(getSpecificPageQuery, deletePageQuery, [req.body.page_id])
		.then (result => {
			if (result == null) {
				res.status(404).send(`No Subpage with page_id: ${req.body.page_id}`);
			} else {
				res.status(200).send();
			}
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const addCategoryQuery = "INSERT INTO category(subject, page_id) VALUES ($1, $2) RETURNING subject, cat_id;";
exports.addCategory = [
	// We first want to verify such message exists and is a well messaget
	body('subject').exists().withMessage("Missing Subject Parameter").bail()
	  .matches(/^[a-zA-Z0-9 ]+$/i).withMessage("Invalid Title Parameter").bail().escape(),
	body('page_id').exists().withMessage("Missing Page Id Parameter").bail()
	  .isInt().withMessage("Invalid Page Id Parameter").bail().escape(),
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
		
		db.task(async t => {
			const result = await t.one(addCategoryQuery, [req.body.subject, req.body.page_id]);
			return result;
		}).then (result => {
			// Since we are returning title back from the query, we will get a response back if successful
			// Therefore we will want to use those feedback to check if query succeeded or failed
			// So now we will want to get things back
			if ("subject" in result) {
				// We want to send back 200 for successful query
				// I am sending back a response just for debugging to see if api actually worked and inserted
				res.status(200).send(`Category inserted with title ${result.subject} and cat_id ${result.cat_id}`);
			} else {
				// The case where it didnt actually insert correctly
				res.status(400).send("Unable to insert the category");
			}
		})
		// We want to catch any exception else your program will crash :) have fun with that 
		.catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];



const getCategoryQuery = "SELECT * FROM category WHERE page_id = $1;";
exports.getCategories = [
	body('page_id').exists().withMessage("Missing Page Id Parameter").bail()
	  .isInt().withMessage("Invalid Page Id Parameter").bail().escape(),
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
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

const getSpecificCategoryQuery = "SELECT * FROM Category WHERE cat_id = $1;";
const deleteCategoryQuery = "DELETE FROM Category WHERE cat_id=$1;";
exports.deleteCategory= [
	body('cat_id').exists().withMessage("Missing Category Id Parameter").bail()
	  .isInt().withMessage("Invalid Category Id Parameter").bail().escape(),
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		runDeleteQuery(getSpecificCategoryQuery, deleteCategoryQuery, [req.body.cat_id])
		.then (result => {
			if (result == null) {
				res.status(404).send(`No Category with cat_id: ${req.body.cat_id}`);
			} else {
				res.status(200).send();
			}
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const addSubCategoryQuery = "INSERT INTO subcategory(subject, main_cat_id) VALUES ($1, $2) RETURNING subject, sub_cat_id;";
exports.addSubCategory = [
	// We first want to verify such message exists and is a well messaget
	body('subject').exists().withMessage("Missing Subject Parameter").bail()
	  .matches(/^[a-zA-Z0-9 ]+$/i).withMessage("Invalid Subject Parameter").bail().escape(),
	body('main_cat_id').exists().withMessage("Missing Category ID Parameter").bail()
	  .isInt().withMessage("Invalid Main Category ID Parameter").bail().escape(),
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
		
		db.task(async t => {
			const result = await t.one(addSubCategoryQuery, [req.body.subject, req.body.main_cat_id]);
			return result;
		}).then (result => {
			// Since we are returning title back from the query, we will get a response back if successful
			// Therefore we will want to use those feedback to check if query succeeded or failed
			// So now we will want to get things back
			if ("subject" in result) {
				// We want to send back 200 for successful query
				// I am sending back a response just for debugging to see if api actually worked and inserted
				//res.status(200).send(`Subategory inserted with subject: "${result.subject}" and sub_cat_id: ${result.sub_cat_id}`);
				res.status(200).json(result);
			} else {
				// The case where it didnt actually insert correctly
				res.status(400).send("Unable to insert the subcategory");
			}
		})
		// We want to catch any exception else your program will crash :) have fun with that 
		.catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const getSubCategoryQuery1 = "select * from subcategory where sub_cat_id = $1;"
const getSubCategoryQuery2 = "select * from category where cat_id = (select main_cat_id from subcategory where sub_cat_id = $1);" 
const getSubCategoryQuery3 = "select * from thread where sub_cat_id = $1;";
exports.getSubCategories = [
	/*
	body('main_cat_id').exists().withMessage("Missing Category Id Parameter").bail()
	  .isInt().withMessage("Invalid Category Id Parameter").bail().escape(),
	  */
	
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		var url = req.url;
		db.task(async t => {
			const subCategory = await t.any(getSubCategoryQuery1, [req.params.sub_cat_id]);
			const Category = await t.any(getSubCategoryQuery2, [req.params.sub_cat_id]);
			const Threads = await t.any(getSubCategoryQuery3, [req.params.sub_cat_id]);
			
			var result = {subCategory, Category, Threads};
			return result;
			
		}).then (result => {
			res.status(200).json(result)
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const getSpecificSubCategoryQuery = "SELECT * FROM Subcategory WHERE sub_cat_id = $1;";
const deleteSubCategoryQuery = "DELETE FROM Subcategory WHERE sub_cat_id=$1;";
exports.deleteSubCategory= [
	body('sub_cat_id').exists().withMessage("Missing Subcategory Id Parameter").bail()
	  .isInt().withMessage("Invalid Subcategory Id Parameter").bail().escape(),
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		runDeleteQuery(getSpecificSubCategoryQuery, deleteSubCategoryQuery, [req.body.sub_cat_id])
		.then (result => {
			if (result == null) {
				res.status(404).send(`No Subcategory with sub_cat_id: ${req.body.sub_cat_id}`);
			} else {
				res.status(200).send();
			}
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const addThreadQuery = "INSERT INTO thread(subject, sub_cat_id, user_account_id) VALUES ($1, $2, $3) RETURNING subject, thread_id";
exports.addThread = [
	body('subject').exists().withMessage("Missing Subject Parameter").bail()
	  .matches(/^[a-zA-Z0-9 ]+$/i).withMessage("Invalid Subject Parameter").bail().escape(),
	body('sub_cat_id').exists().withMessage("Missing subcategory Id Parameter").bail()
	  .isInt().withMessage("Invalid subcategory Id Parameter").bail().escape(),
	//   We can comment user_acount_id out until we need it
	// body('user_account_id').exists().withMessage("Missing User Account Id Parameter").bail()
	//   .isInt().withMessage("Invalid User Account Id Parameter").bail().escape(),

	async function (req, res, next) {
		//see if we have any errors
		const errors = validationResult(req);

		if (!errors.isEmpty()) {
			// if there are errors, we return 400
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		db.task(async t => {
			const result = await t.one(addThreadQuery, [req.body.subject, req.body.sub_cat_id, req.body.user_account_id]);
			return result;
		}).then (result => {
			if ("subject" in result) {
				res.status(200).send(`Thread inserted with title: "${result.subject}" and thread_id: ${result.thread_id}`);
			} else {
				res.status(400).send("Unable to insert the thread");
			}
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const getThreadQuery = "SELECT * FROM thread where sub_cat_id = $1;";
exports.getThreads = [
	body('sub_cat_id').exists().withMessage("Missing Subategory Id Parameter").bail()
	  .isInt().withMessage("Invalid Subategory Id Parameter").bail().escape(),
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		db.task(async t => {
			const result = await t.any(getThreadQuery, [req.body.sub_cat_id]);
			return result;
		}).then (result => {
			res.status(200).json(result)
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const getSpecificThreadQuery = "SELECT * FROM thread WHERE thread_id = $1;";
const deleteThreadQuery = "DELETE FROM thread WHERE thread_id=$1;";
exports.deleteThread = [
	body('thread_id').exists().withMessage("Missing Thread Id Parameter").bail()
	  .isInt().withMessage("Invalid Thread Id Parameter").bail().escape(),
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		runDeleteQuery(getSpecificThreadQuery, deleteThreadQuery, [req.body.thread_id])
		.then (result => {
			if (result == null) {
				res.status(404).send(`No thread with thread_id: ${req.body.thread_id}`);
			} else {
				res.status(200).send();
			}
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const updateThreadQuery = "UPDATE thread SET subject=$1 WHERE thread_id=$2 RETURNING thread_id;";
exports.updateThread = [
	body('thread_id').exists().withMessage("Missing Thread Id Parameter").bail()
	  .isInt().withMessage("Invalid Thread Id Parameter").bail().escape(),
	body('subject').exists().withMessage("Missing Subject Parameter").bail()
	  .matches(/^[a-zA-Z0-9 ]+$/i).withMessage("Invalid Subject Parameter").bail().escape(),
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		db.task(async t => {
			return await t.any(getSpecificThreadQuery, [req.body.thread_id])
						  .then(post => {
							  if (post.length == 0) {
									return null;
							  }	else {
								  	return t.one(updateThreadQuery, [req.body.subject, req.body.thread_id]);
						  }}).catch(e => {throw e})		
		}).then (result => {
			if (result == null) {
				res.status(404).send(`No thread with thread_id: ${req.body.thread_id}`);
			} else if ("thread_id" in result) {
				res.status(200).send(`Thread ${result.thread_id} title updated`);
			} else {
				res.status(400).send("Unable to update the thread subject");
			}
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const addPostQuery = "INSERT INTO post(content, thread_id) VALUES ($1, $2) RETURNING content, post_id";
exports.addPost = [
	body('content').exists().withMessage("Missing Content Parameter").bail()
	  .matches(/^[a-zA-Z0-9 ]+$/i).withMessage("Invalid Content Parameter").bail().escape(),
	body('thread_id').exists().withMessage("Missing Thread Id Parameter").bail()
	  .isInt().withMessage("Invalid Thread Id Parameter").bail().escape(),

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
			const result = await t.one(addPostQuery, [req.body.content,req.body.thread_id]);
			return result;
		}).then (result => {
			if ("content" in result) {
				// return 200 if we successfully added the page
				res.status(200).send(`Post inserted with content: "${result.content}" and post_id: ${result.post_id}`); 
			} else {
				// return 400 if we unsuccessfully added the page
				res.status(400).send("Unable to insert the post");
			}
		})
		// We want to catch any exception else your program will crash :) have fun with that 
		.catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const getSpecificPostQuery = "SELECT * FROM post WHERE post_id = $1 AND thread_id = $2;";
const deletePostQuery = "DELETE FROM post WHERE post_id = $1 AND thread_id=$2;";
exports.deletePost = [
	body('post_id').exists().withMessage("Missing Post Id Parameter").bail()
	  .isInt().withMessage("Invalid Post Id Parameter").bail().escape(),
	body('thread_id').exists().withMessage("Missing Thread Id Parameter").bail()
	  .isInt().withMessage("Invalid Thread Id Parameter").bail().escape(),
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		runDeleteQuery(getSpecificPostQuery, deletePostQuery, [req.body.post_id, req.body.thread_id])
		.then (result => {
			if (result == null) {
				res.status(404).send(`No post with post_id ${req.body.post_id} and thread_id: ${req.body.thread_id}`);
			} else {
				res.status(200).send();
			}
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const getPostQuery = "SELECT * FROM post WHERE thread_id = $1;";
exports.getPosts = [
	body('thread_id').exists().withMessage("Missing Thread Id Parameter").bail()
	  .isInt().withMessage("Invalid Thread Id Parameter").bail().escape(),
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		db.task(async t => {
			const result = await t.any(getPostQuery, [req.body.thread_id]);
			return result;
		}).then (result => {
			res.status(200).json(result)
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const updatePostQuery = "UPDATE post SET content=$1 WHERE post_id=$2 AND thread_id=$3 RETURNING thread_id, post_id;";
exports.updatePost = [
	body('post_id').exists().withMessage("Missing Post Id Parameter").bail()
	  .isInt().withMessage("Invalid Post Id Parameter").bail().escape(),
    body('thread_id').exists().withMessage("Missing Thread Id Parameter").bail()
	   .isInt().withMessage("Invalid Thread Id Parameter").bail().escape(),
	body('content').exists().withMessage("Missing Content Parameter").bail()
	  .matches(/^[a-zA-Z0-9 ]+$/i).withMessage("Invalid Content Parameter").bail().escape(),
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		
		db.task(async t => {
			return await t.any(getSpecificPostQuery, [req.body.post_id, req.body.thread_id])
						  .then(post => {
							  if (post.length == 0) {
									return null;
							  }	else {
								  	return t.one(updatePostQuery, [req.body.content, req.body.post_id, req.body.thread_id])
						  }}).catch(e => {throw e})				
		}).then (result => {
			if (result == null) {
				res.status(404).send(`No post with post_id "${req.body.post_id}" and thread_id: ${req.body.thread_id}`);
			} else if ("post_id" in result && "thread_id" in result) {
				res.status(200).send(`Contents of post ${result.post_id} of thread ${result.thread_id} updated`);
			} else {
				res.status(400).send("Unable to update the thread subject");
			}
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

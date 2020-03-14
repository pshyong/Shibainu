// ! Please follow these for developing your api
// ! https://florimond.dev/blog/articles/2018/08/restful-api-design-13-best-practices-to-make-your-users-happy/

// Constants that we should be using to grab both our configuration
// and express sanitization/validator
require('dotenv').config();

const post_limit = process.env.POST_LIMIT
const delay = process.env.DELAY

const db = require('../../config')
const express = require('express')
var moment = require('moment')

const {
  body,
	param,
	validationResult
} = require('express-validator');
 
function sendJSON(statusCode, payload) {
  return JSON.stringify({ status_code: statusCode, payload: payload });
}

function sendError(statusCode, message, additionalInfo = {}) {
  return JSON.stringify({
    status_code: statusCode,
    error: { message: message, additional_information: additionalInfo }
  });
}

// Gets the time until a thread or post is visible. 
function getTimeUntilVisible(created_time) {
  var d = new Date();
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  let offset = -4;
  var toronto = new Date(utc + (3600000*offset));
  // Get timestamp in ms since January 1, 1970 00:00:00 UTC:
  // var current = Date();
  // Parse a date in ms since January 1, 1970 00:00:00 UTC
  var created = Date.parse(created_time);
  var diff = toronto - created;
  // Convert to minutes;
  diff = Math.floor(diff/1000/60);

  // delay is defined in .env
  return delay - diff;

}
function runDeleteQuery(selectQuery, deleteQuery, args) {
  return db.task(async t => {
    return await t
      .any(selectQuery, args)
      .then(post => {
        if (post.length == 0) {
          return null;
        } else {
          return t.result(deleteQuery, args);
        }
      })
      .catch(e => {
        throw e;
      });
  });
}

const getPagesQuery = 'SELECT * FROM subpage WHERE page_id = $1;';
const addPageQuery =
  'INSERT INTO subpage(title) VALUES ($1) RETURNING title, page_id';
exports.addPage = [
  // We first want to verify expected parameters and escape any special characters
  body('title')
    .exists()
    .withMessage('Missing Title Parameter')
    .bail()
    .matches(/^[a-zA-Z0-9 ]+$/i)
    .withMessage('Invalid Title Parameter')
    .bail()
    .escape(),
  // As we get more fields to add, you must keep adding on to this
  // refer to express-validator if you're unsure what to do here
  // Removed sanitize body, since it will now be deprecated
  // You can do more checking by express-validator's sanitization middlewares

  async function(req, res, next) {
    // First see if we have any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors. We want to render form again with sanitized values/errors messages.
      res.status(400).json({ errors: errors.array() });
      return;
    }

    // use db.task(async t => {}) to create the promise
    db.task(async t => {
      // do actual db calls in async t => {}
      // wait for db to give results back
      const result = await t.one(addPageQuery, [req.body.title]);

      // return results to be used in the 'then' call
      return result;
    })
      .then(result => {
        // Since we are returning title back from the query, we will get a response back if successful
        // Therefore we will want to use those feedback to check if query succeeded or failed
        // So now we will want to get things back
        if ('title' in result) {
          // We want to send back 200 for successful query

          res.status(200).json(result);
        } else {
          // The case where it didnt actually insert correctly
          res.status(400).send('Unable to insert the subpage');
        }
      })
      // We want to catch any exception else your program will crash :) have fun with that
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

exports.getPages = [

	param('page_id').exists().withMessage("Missing Page id Parameter").bail(),

	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		let getSubpage = `SELECT * FROM subpage WHERE LOWER(title) = LOWER($1)`;
		let getPagesCatQuery = "SELECT * FROM category WHERE page_id = $1;";
		let getPagesSubCatQuery = "SELECT * FROM subcategory WHERE main_cat_id = $1;";

		db.task(async t => {
			
			let subpage = await t.any(getSubpage, [req.params.page_id]);
			if (subpage.length == 0) {
				return 404;
			} else {
				subpage = subpage[0];
			}
			let page_id = subpage["page_id"]
			
			let page_d = subpage;
			let cat_d = await t.any(getPagesCatQuery, [page_id]);
			let subcat = await t.any(getPagesSubCatQuery, [page_id]);

			let result = {"subpage": page_d , 'category': cat_d, 'sub_category': []}

			//loop through each cat to get their sub cats
			for (const element of cat_d) {
				var temp = await t.any(getPagesSubCatQuery, [element.cat_id]);
				result['sub_category'].push(temp);
		
			}

			return result;

		}).then (result => {
			if (result === 404) {
				res.status(404).send();
				return;
			}
			res.status(200).json(result);
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const getSpecificPageQuery = "SELECT * FROM Subpage WHERE LOWER(title) = LOWER($1)";
const deletePageQuery = "DELETE FROM Subpage WHERE LOWER(title) = LOWER($1);";
exports.deletePage= [
	body('page_id').exists().withMessage("Missing Subpage Id Parameter").bail(),
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

const addCategoryQuery =
  'INSERT INTO category(subject, page_id) VALUES ($1, $2) RETURNING subject, cat_id;';
exports.addCategory = [
  // We first want to verify such message exists and is a well messaget
  body('subject')
    .exists()
    .withMessage('Missing Subject Parameter')
    .bail()
    .matches(/^[a-zA-Z0-9 ]+$/i)
    .withMessage('Invalid Title Parameter')
    .bail()
    .escape(),
  body('page_id')
    .exists()
    .withMessage('Missing Page Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Page Id Parameter')
    .bail()
    .escape(),
  // As we get more fields to add, you must keep adding on to this
  // refer to express-validator if you're unsure what to do here
  // Removed sanitize body, since it will now be deprecated
  // You can do more checking by express-validator's sanitization middlewares

  async function(req, res, next) {
    // First see if we have any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors. We want to render form again with sanitized values/errors messages.
      res.status(400).json({ errors: errors.array() });
      return;
    }

    db.task(async t => {
      const result = await t.one(addCategoryQuery, [
        req.body.subject,
        req.body.page_id
      ]);
      return result;
    })
      .then(result => {
        // Since we are returning title back from the query, we will get a response back if successful
        // Therefore we will want to use those feedback to check if query succeeded or failed
        // So now we will want to get things back
        if ('subject' in result) {
          // We want to send back 200 for successful query
          // I am sending back a response just for debugging to see if api actually worked and inserted
          res
            .status(200)
            .send(
              `Category inserted with title ${result.subject} and cat_id ${result.cat_id}`
            );
        } else {
          // The case where it didnt actually insert correctly
          res.status(400).send('Unable to insert the category');
        }
      })
      // We want to catch any exception else your program will crash :) have fun with that
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

const getCategoryQuery = 'SELECT * FROM category WHERE page_id = $1;';
exports.getCategories = [
  body('page_id')
    .exists()
    .withMessage('Missing Page Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Page Id Parameter')
    .bail()
    .escape(),
  async function(req, res, next) {
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
    })
      .then(result => {
        res.status(200).json(result);
      })
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

const getSpecificCategoryQuery = 'SELECT * FROM Category WHERE cat_id = $1;';
const deleteCategoryQuery = 'DELETE FROM Category WHERE cat_id=$1;';
exports.deleteCategory = [
  body('cat_id')
    .exists()
    .withMessage('Missing Category Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Category Id Parameter')
    .bail()
    .escape(),
  async function(req, res, next) {
    // First see if we have any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors. We want to render form again with sanitized values/errors messages.
      res.status(400).json({ errors: errors.array() });
      return;
    }

    runDeleteQuery(getSpecificCategoryQuery, deleteCategoryQuery, [
      req.body.cat_id
    ])
      .then(result => {
        if (result == null) {
          res.status(404).send(`No Category with cat_id: ${req.body.cat_id}`);
        } else {
          res.status(200).send();
        }
      })
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

const addSubCategoryQuery =
  'INSERT INTO subcategory(subject, main_cat_id) VALUES ($1, $2) RETURNING subject, sub_cat_id;';
exports.addSubCategory = [
  // We first want to verify such message exists and is a well messaget
  body('subject')
    .exists()
    .withMessage('Missing Subject Parameter')
    .bail()
    .matches(/^[a-zA-Z0-9 ]+$/i)
    .withMessage('Invalid Subject Parameter')
    .bail()
    .escape(),
  body('main_cat_id')
    .exists()
    .withMessage('Missing Category ID Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Main Category ID Parameter')
    .bail()
    .escape(),
  // As we get more fields to add, you must keep adding on to this
  // refer to express-validator if you're unsure what to do here
  // Removed sanitize body, since it will now be deprecated
  // You can do more checking by express-validator's sanitization middlewares

  async function(req, res, next) {
    // First see if we have any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors. We want to render form again with sanitized values/errors messages.
      res.status(400).json({ errors: errors.array() });
      return;
    }

    db.task(async t => {
      const result = await t.one(addSubCategoryQuery, [
        req.body.subject,
        req.body.main_cat_id
      ]);
      return result;
    })
      .then(result => {
        // Since we are returning title back from the query, we will get a response back if successful
        // Therefore we will want to use those feedback to check if query succeeded or failed
        // So now we will want to get things back
        if ('subject' in result) {
          // We want to send back 200 for successful query
          // I am sending back a response just for debugging to see if api actually worked and inserted
          //res.status(200).send(`Subategory inserted with subject: "${result.subject}" and sub_cat_id: ${result.sub_cat_id}`);
          res.status(200).json(result);
        } else {
          // The case where it didnt actually insert correctly
          res.status(400).send('Unable to insert the subcategory');
        }
      })
      // We want to catch any exception else your program will crash :) have fun with that
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

const getSubCategoryQuery1 = "select * from subcategory where sub_cat_id = $1;"
const getSubCategoryQuery2 = "select * from category where cat_id = (select main_cat_id from subcategory where sub_cat_id = $1);" 
const getSubCategoryQuery3 = `select * from thread where sub_cat_id = $1 limit ${post_limit} offset $2;`;
exports.getSubCategories = [
  /*
	body('main_cat_id').exists().withMessage("Missing Category Id Parameter").bail()
	  .isInt().withMessage("Invalid Category Id Parameter").bail().escape(),
	  */

  async function(req, res, next) {
    // First see if we have any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors. We want to render form again with sanitized values/errors messages.
      res.status(400).json({ errors: errors.array() });
      return;
    }
    var url = req.url;
    db.task(async t => {
      let offset = (req.params.page_num-1)*post_limit;
      const subCategory = await t.any(getSubCategoryQuery1, [
        req.params.sub_cat_id
      ]);
      const Category = await t.any(getSubCategoryQuery2, [
        req.params.sub_cat_id
      ]);
      const Threads = await t.any(getSubCategoryQuery3, [
        req.params.sub_cat_id, offset
      ]);

      var result = { subCategory, Category, Threads };
      return result;
    })
      .then(result => {
        res.status(200).json(result);
      })
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

const getSpecificSubCategoryQuery =
  'SELECT * FROM Subcategory WHERE sub_cat_id = $1;';
const deleteSubCategoryQuery = 'DELETE FROM Subcategory WHERE sub_cat_id=$1;';
exports.deleteSubCategory = [
  body('sub_cat_id')
    .exists()
    .withMessage('Missing Subcategory Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Subcategory Id Parameter')
    .bail()
    .escape(),
  async function(req, res, next) {
    // First see if we have any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors. We want to render form again with sanitized values/errors messages.
      res.status(400).json({ errors: errors.array() });
      return;
    }

    runDeleteQuery(getSpecificSubCategoryQuery, deleteSubCategoryQuery, [
      req.body.sub_cat_id
    ])
      .then(result => {
        if (result == null) {
          res
            .status(404)
            .send(`No Subcategory with sub_cat_id: ${req.body.sub_cat_id}`);
        } else {
          res.status(200).send();
        }
      })
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

exports.addThread = [
  body('subject')
    .exists()
    .withMessage('Missing Subject Parameter')
    .bail()
    .withMessage('Invalid Subject Parameter')
    .bail()
    .escape(),
  body('sub_cat_id')
    .exists()
    .withMessage('Missing subcategory Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid subcategory Id Parameter')
    .bail()
    .escape(),
  body('content')
    .exists()
    .withMessage('Missing content Parameter')
    .bail()
    .escape(),
  //   We can comment user_acount_id out until we need it
  // body('user_account_id').exists().withMessage("Missing User Account Id Parameter").bail()
  //   .isInt().withMessage("Invalid User Account Id Parameter").bail().escape(),

  async function(req, res, next) {
    //see if we have any errors
    const errors = validationResult(req);

	if (!errors.isEmpty()) {
		// if there are errors, we return 400
		res.status(400).json({ errors: errors.array() });
		return;
	}
	
	result = {}
	let addThreadQuery = 'INSERT INTO thread(subject, sub_cat_id, session_id) VALUES ($1, $2, $3) RETURNING thread_id, subject';
	const addPostQuery = 'INSERT INTO post(content, thread_id, session_id) VALUES ($1, $2, $3) RETURNING post_id, content;';
	
	console.log(req.session)
	db.task(async t => {
		return await t.one(addThreadQuery, [req.body.subject, req.body.sub_cat_id, req.session.id])
					   .then(thread => {
						   if ("thread_id" in thread) {
							   thread_id = thread.thread_id;
							   result.thread = thread;
							   return t.one(addPostQuery, [req.body.content, thread_id, req.session.id])
							    	   .then(post => {
							    		   if ("post_id" in post) {
							    			   result.post = post;
							    			   return result;
							    		   } else {
							    			   dbError = "Unable to create a post after the thread"
							    			   return null;
							    		   }
							    	   }).catch(e => {throw e})	;
						   } else {
							   return null
						   }
					   }).catch(e => {throw e})	
					   
	}).then (result => {
		if (result == null) {
			res.status(400).send(dbError);
		} else {
			res.status(200).send(result);
		}
	}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];


exports.getThread = [
	param('thread_id')
	.exists()
	.isInt()
	.withMessage("Missing Thread Id Parameter").bail()
	.withMessage("Invalid Thread Id Parameter").bail().escape(),
	param('page_num')
	.exists()
	.isInt()
	.withMessage("Missing Page Number Parameter").bail()
	.withMessage("Invalid Page Number Parameter").bail().escape(),
	async function (req, res, next) {
		// First see if we have any errors
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// If there are errors. We want to render form again with sanitized values/errors messages.
			res.status(400).json({ errors: errors.array() });
			return;
		}
		let getThreadQuery = "SELECT * FROM thread  WHERE thread_id = $1;";
		let getPostsQuery = `SELECT * FROM post WHERE thread_id = $1 limit ${post_limit} offset $2;`;

		db.task(async t => {
			let thread_id = req.params.thread_id;
			let offset = (req.params.page_num - 1) * post_limit
			const thread = await t.any(getThreadQuery, [thread_id]);
      
			if (!thread[0]) {
				res.status(400).send('Thread not found');
        return;
      }

      var result = {};
      var diff = getTimeUntilVisible(thread[0].created);

      // Checking if thread is posted anonymously and time elapsed
      if (diff > 0 && thread[0].user_account_id == 0) {
        result.thread_id = thread[0].thread_id;
        result.delayed = `${diff} minutes left until thread is visible`
        return result;
      }
      
      const posts = await t.any(getPostsQuery, [thread_id, offset]);
      // A thread must've been created with at least one post, hence we also check for post.
      if (!posts[0]) {
				res.status(400).send('Empty thread');
				return;
      }

      // Checking each post if it was made anonymously and time elapsed.
      for (i = 0; i < posts.length; i++) {
        if (posts[i].user_account_id != 0) continue;
        diff = getTimeUntilVisible(posts[i].created);
        var temp = {};
        temp.post_id = posts[i].post_id;
        temp.delayed = "";
        if (diff > 0) {
          temp["delayed"] = `${diff} minutes left until post is visible`  
          posts[i] = temp;
       }
      }

			result = thread[0]; 
			result.posts = posts;
      return result;
      
		}).then (result => {
			res.status(200).json(result)
		}).catch(e => {res.status(500); res.send(sendError(500, '/api' + req.url + ' error ' + e))})
	}
];

const updateThreadQuery =
  'UPDATE thread SET subject=$1 WHERE thread_id=$2 RETURNING thread_id;';
exports.updateThread = [
  body('thread_id')
    .exists()
    .withMessage('Missing Thread Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Thread Id Parameter')
    .bail()
    .escape(),
  body('subject')
    .exists()
    .withMessage('Missing Subject Parameter')
    .bail()
    .withMessage('Invalid Subject Parameter')
    .bail()
    .escape(),
  async function(req, res, next) {
    // First see if we have any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors. We want to render form again with sanitized values/errors messages.
      res.status(400).json({ errors: errors.array() });
      return;
    }

    db.task(async t => {
      return await t
        .any(getSpecificThreadQuery, [req.body.thread_id])
        .then(post => {
          if (post.length == 0) {
            return null;
          } else {
            return t.one(updateThreadQuery, [
              req.body.subject,
              req.body.thread_id
            ]);
          }
        })
        .catch(e => {
          throw e;
        });
    })
      .then(result => {
        if (result == null) {
          res
            .status(404)
            .send(`No thread with thread_id: ${req.body.thread_id}`);
        } else if ('thread_id' in result) {
          res.status(200).send(`Thread ${result.thread_id} title updated`);
        } else {
          res.status(400).send('Unable to update the thread subject');
        }
      })
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

const getSpecificThreadQuery = 'SELECT * FROM thread WHERE thread_id = $1;';
const deleteThreadQuery = 'DELETE FROM thread WHERE thread_id=$1;';
exports.deleteThread = [
  body('thread_id')
    .exists()
    .withMessage('Missing Thread Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Thread Id Parameter')
    .bail()
    .escape(),
  async function(req, res, next) {
    // First see if we have any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors. We want to render form again with sanitized values/errors messages.
      res.status(400).json({ errors: errors.array() });
      return;
    }

    runDeleteQuery(getSpecificThreadQuery, deleteThreadQuery, [
      req.body.thread_id
    ])
      .then(result => {
        if (result == null) {
          res
            .status(404)
            .send(`No thread with thread_id: ${req.body.thread_id}`);
        } else {
          res.status(200).send();
        }
      })
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

exports.addPost = [

  body('content')
    .exists()
    .withMessage('Missing Content Parameter')
    .bail()
    .withMessage('Invalid Content Parameter')
    .bail()
    .escape(),
  body('thread_id')
    .exists()
    .withMessage('Missing Thread Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Thread Id Parameter')
    .bail()
    .escape(),
  async function(req, res, next) {
    //see if we have any errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // if there are errors, we return 400
      res.status(400).json({ errors: errors.array() });
      return;
    }
    //here may be have to check if post is already in db?
    //  RETURNING content, post_id"
    const addPostQuery =
   	 "UPDATE thread SET number_of_posts=(number_of_posts + 1) WHERE thread_id = $2;" + 
	 "INSERT INTO post(content, thread_id, session_id) VALUES ($1, $2, $3) RETURNING post_id;";
    db.task(async t => {
      //try to add to the db
      const result = await t.one(addPostQuery, [
        req.body.content,
        req.body.thread_id,
        req.session.id
      ]);
      return result;
    })
      .then(result => {
        if ('post_id' in result) {
          // return 200 if we successfully added the page
          // KEEP OLD CODE so I know how to format the string :D
          // res.status(200).send(`Post inserted with content: "${result.content}" and post_id: ${result.post_id}`);
          res.status(200).send(result);
        } else {
          // return 400 if we unsuccessfully added the page
          res.status(400).send('Unable to create the post');
        }
      })
      // We want to catch any exception else your program will crash :) have fun with that
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

exports.getPost = [
  param('post_id')
    .exists()
    .withMessage('Missing Post Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Post Id Parameter')
    .bail()
    .escape(),
  async function(req, res, next) {
    // First see if we have any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors. We want to render form again with sanitized values/errors messages.
      res.status(400).json({ errors: errors.array() });
      return;
    }
    let getPostQuery = 'SELECT * FROM post WHERE post_id = $1;';

    db.task(async t => {
      let post_id = req.params.post_id;
      const posts = await t.any(getPostQuery, [post_id]);
      if (!posts[0]) {
        res.status(400).send('Post not found');
        return;
      }
      var result = {};
      result = posts[0];
      return result;
    })
      .then(result => {
        res.status(200).json(result);
      })
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

const updatePostQuery =
  'UPDATE post SET content=$1 WHERE post_id=$2 AND thread_id=$3 RETURNING thread_id, post_id;';
exports.updatePost = [
  body('post_id')
    .exists()
    .withMessage('Missing Post Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Post Id Parameter')
    .bail()
    .escape(),
  body('thread_id')
    .exists()
    .withMessage('Missing Thread Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Thread Id Parameter')
    .bail()
    .escape(),
  body('content')
    .exists()
    .withMessage('Missing Content Parameter')
    .bail()
    .matches(/^[a-zA-Z0-9 ]+$/i)
    .withMessage('Invalid Content Parameter')
    .bail()
    .escape(),
  async function(req, res, next) {
    // First see if we have any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors. We want to render form again with sanitized values/errors messages.
      res.status(400).json({ errors: errors.array() });
      return;
    }

    db.task(async t => {
      return await t
        .any(getSpecificPostQuery, [req.body.post_id, req.body.thread_id])
        .then(post => {
          if (post.length == 0) {
            return null;
          } else {
            return t.one(updatePostQuery, [
              req.body.content,
              req.body.post_id,
              req.body.thread_id
            ]);
          }
        })
        .catch(e => {
          throw e;
        });
    })
      .then(result => {
        if (result == null) {
          res
            .status(404)
            .send(
              `No post with post_id "${req.body.post_id}" and thread_id: ${req.body.thread_id}`
            );
        } else if ('post_id' in result && 'thread_id' in result) {
          res
            .status(200)
            .send(
              `Contents of post ${result.post_id} of thread ${result.thread_id} updated`
            );
        } else {
          res.status(400).send('Unable to update the thread subject');
        }
      })
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

const getSpecificPostQuery =
  'SELECT * FROM post WHERE post_id = $1 AND thread_id = $2;';
const deletePostQuery = 'DELETE FROM post WHERE post_id = $1 AND thread_id=$2;';
exports.deletePost = [
  body('post_id')
    .exists()
    .withMessage('Missing Post Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Post Id Parameter')
    .bail()
    .escape(),
  body('thread_id')
    .exists()
    .withMessage('Missing Thread Id Parameter')
    .bail()
    .isInt()
    .withMessage('Invalid Thread Id Parameter')
    .bail()
    .escape(),
  async function(req, res, next) {
    // First see if we have any errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors. We want to render form again with sanitized values/errors messages.
      res.status(400).json({ errors: errors.array() });
      return;
    }

    runDeleteQuery(getSpecificPostQuery, deletePostQuery, [
      req.body.post_id,
      req.body.thread_id
    ])
      .then(result => {
        if (result == null) {
          res
            .status(404)
            .send(
              `No post with post_id ${req.body.post_id} and thread_id: ${req.body.thread_id}`
            );
        } else {
          res.status(200).send();
        }
      })
      .catch(e => {
        res.status(500);
        res.send(sendError(500, '/api' + req.url + ' error ' + e));
      });
  }
];

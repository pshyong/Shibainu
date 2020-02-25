var express = require('express');
var router = express.Router({ mergeParams: true, strict: true});
// const category = require('express').Router({ mergeParams: true });

const db = require('./queries');
const bodyParser = require('body-parser');

/* API routers */
// ! Try and group the api calls to ones that are similar
// ! All api calls should be going through /api/whatever

router.route('/v1/pages/:page_id')
    /**
     * @swagger
     *
     * /pages/{page_id}:
     *   get:
     *     description: Returns the subpage requested along with the categories that belong with it, aswell the subcategories that belong with those categories 
     *     tags:
     *       - Pages
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: page_id
     *         description: The id of the subpage
     *         in: path
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Successfully got the page
     *         schema:
     *           example: {
                            "page_d": [
                                {
                                "page_id": 1,
                                "title": "Toyota",
                                "description": null,
                                "visiter_count": 0,
                                "created": "2020-02-22T05:01:56.255Z"
                                }
                            ],
                            "cat_d": [
                                {
                                "cat_id": 1,
                                "subject": "Sports Cars",
                                "created": "2020-02-22T05:26:50.633Z",
                                "page_id": 1
                                }
                            ],
                            "subcat_d": [
                                [
                                {
                                    "sub_cat_id": 1,
                                    "created": "2020-02-23T04:27:46.861Z",
                                    "main_cat_id": 1,
                                    "subject": "Supra"
                                },
                                {
                                    "sub_cat_id": 2,
                                    "created": "2020-02-23T04:27:50.041Z",
                                    "main_cat_id": 1,
                                    "subject": "GT86"
                                }
                                ]
                            ]
                            }
            
     *       400:
     *         description: Could not get the requested page
     *       500:
     *         description: Internal server error
     *       
     */
    .get(db.getPages)
    /**
     * @swagger
     *
     * /pages/page:
     *   post:
     *     description: Create a new subpage to the database, returns a JSON containing the page_id and title
     *     tags:
     *       - Pages
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: title
     *         description: The title of the new subpage
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Successfully created a new page
     *         schema:
     *           example: {"title": "Page Name!","page_id": 12}
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not create the requested page
     */
    .post(db.addPage)

router.route('/v1/pages/Category')
    /**
     * @swagger
     *
     * /pages/Category:
     *   get:
     *     description: Get all the categories of a subpage
     *     tags:
     *       - Category
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: page_id
     *         description: The id of the subpage
     *         in: formData
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Successfully get the categories of the page
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not get the subpage's category
     */
    .get(db.getCategories)
    /**
     * @swagger
     *
     * /pages/Category:
     *   post:
     *     description: Create a new category in the specified category
     *     tags:
     *       - Category
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: page_id
     *         description: The id of the subpage
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: subject
     *         description: The subject of the category
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Successfully created the category
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not create the category
     */
    .post(db.addCategory)

router.route('/v1/pages/subCategory')
    /**
     * @swagger
     *
     * /pages/subCategory:
     *   get:
     *     description: Get the all the subcategory associated to the subcategory
     *     tags:
     *       - Sub Category
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: main_cat_id
     *         description: The id of the corresponding subcategory
     *         in: formData
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Successfully get the subcategories
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not get the subcategory
     */
    .get(db.getSubCategories)
    /**
     * @swagger
     *
     * /pages/subCategory:
     *   post:
     *     description: Create a new sub-category in the specified category
     *     tags:
     *       - Sub Category
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: main_cat_id
     *         description: The id of the corresponding category to add to
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: subject
     *         description: The subject of the subcategory
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Successfully created the subcategory
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not create the subcategory
     */
    .post(db.addSubCategory)

router.route('/v1/pages/Thread')
    /**
     * @swagger
     *
     * /pages/Thread:
     *   get:
     *     description: Get the specified thread
     *     tags:
     *       - Thread
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: sub_cat_id
     *         description: The id of the corresponding thread
     *         in: formData
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Successfully get a specified thread
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not get the specified thread
     */
    .get(db.getThreads)
    /**
     * @swagger
     *
     * /pages/Thread:
     *   post:
     *     description: Create a new thread in a specified sub cateogry
     *     tags:
     *       - Thread
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: sub_cat_id
     *         description: The id of the corresponding subcategory
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: subject
     *         description: The subject of the thread (aka. Title)
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Successfully created a thread inside
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not create the subcategory
     */
    // ! Add thread should also be adding a post since they correlates to each other
    // ! When a user create a thread, they also create a post but as id 1
    .post(db.addThread)

router.route('/v1/pages/Post')
    /**
     * @swagger
     *
     * /pages/Post:
     *   get:
     *     description: Get all the post in a specified threads
     *     tags:
     *       - Post
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: thread_id
     *         description: The id of the corresponding thread
     *         in: formData
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Successfully get all the posts in a thread
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not get the corresponding posts in a thread
     */
    .get(db.getPosts)
    /**
     * @swagger
     *
     * /pages/Post:
     *   post:
     *     description: Create a new post in a specified thread
     *     tags:
     *       - Post
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: thread_id
     *         description: The id of the corresponding thread
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: content
     *         description: The content of a post
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Successfully created a post inside a specified thread
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not create a new post
     */
    .post(db.addPost)


module.exports = router;
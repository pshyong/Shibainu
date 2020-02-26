var express = require('express');
var router = express.Router({ mergeParams: true, strict: true});
// const category = require('express').Router({ mergeParams: true });

const db = require('./queries');
const bodyParser = require('body-parser');

/* API routers */
// ! Try and group the api calls to ones that are similar
// ! All api calls should be going through /api/whatever

router.route('/v1/pages/page')
    /**
     * @swagger
     *
     * /pages/page:
     *   get:
     *     description: Returns all the pages in the forums
     *     tags:
     *       - Pages
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Successfully get all pages
     *         schema:
     *           example: [{"page_id": 1, "title": "I am a page", "description": "Description for a page", "visitor_count": 0, "created": "2020-02-13 08:10:19.72336+07"}]
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not get all the pages
     */
    .get(db.getPages)
    /**
     * @swagger
     *
     * /pages/page:
     *   post:
     *     description: Create a new subpage to the database
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
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not create the requested page
     */
    .post(db.addPage)
    /**
     * @swagger
     *
     * /pages/page:
     *   delete:
     *     description: Delete the specified subpage
     *     tags:
     *       - Pages
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: page_id
     *         description: The id of the subpage being deleted
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Successfully deleted the subpage
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not delete the specified subpage
     *       404:
     *         description: The specified subpage does not exist in the database
     */
    .delete(db.deletePage)

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
    /**
     * @swagger
     *
     * /pages/Category:
     *   delete:
     *     description: Delete the specified category
     *     tags:
     *       - Category
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: cat_id
     *         description: The id of the category being deleted
     *         in: formData
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Successfully deleted the category
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not delete the category
     *       404:
     *         description: The category does not exists
     */
    .delete(db.deleteCategory)

router.route('/v1/pages/subCategory/:sub_cat_id')
    /**
     * @swagger
     *
     * /pages/subCategory/{sub_cat_id}:
     *   get:
     *     description: Get the all the subcategory associated to the subcategory
     *     tags:
     *       - Sub Category
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: name
     *         description: The id of the corresponding subcategory
     *         in: path
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
     * /pages/subCategory/sub:
     *   post:
     *     description: Create a new sub-category in the specified category
     *     tags:
     *       - Sub Category
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: sub_cat_id
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
    /**
     * @swagger
     *
     * /pages/subCategory/del:
     *   delete:
     *     description: Delete the specified Subcategory
     *     tags:
     *       - Sub Category
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: sub_cat_id
     *         description: The id of the Subcategory being delete
     *         in: formData
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Successfully Deleted the subcategory
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not delete the subcategory
     *       404:
     *         description: Could not find the specified subcategory 
     */
    .delete(db.deleteSubCategory)

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
     *         description: Could not create the thread
     */
    // ! Add thread should also be adding a post since they correlates to each other
    // ! When a user create a thread, they also create a post but as id 1
    .post(db.addThread)
     /**
     * @swagger
     *
     * /pages/Thread:
     *   delete:
     *     description: Delete the specified thread 
     *     tags:
     *       - Thread
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: thread_id
     *         description: The id of the thread being delete
     *         in: formData
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Successfully deleted the thread
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not delete the thread
     *       404:
     *         description: The thread does not exists
     */
    .delete(db.deleteThread)
    /**
     * @swagger
     *
     * /pages/Thread:
     *   put:
     *     description: Update the subject of an existing thread
     *     tags:
     *       - Thread
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: thread_id
     *         description: The id of the thread being updated
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: subject
     *         description: The new subject of the thread (aka. Title)
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Successfully update the subject of the thread
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not update the thread's subject
     *       404:
     *         description: Thread does not exists in database 
     */
    .put(db.updateThread)

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
    /**
     * @swagger
     *
     * /pages/Post:
     *   delete:
     *     description: Delete an existing post in a specified thread
     *     tags:
     *       - Post
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: post_id
     *         description: The id of the post
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: thread_id
     *         description: The id of the thread that the post belongs to
     *         in: formData
     *         required: true
     *         type: integer
     *     responses:
     *       200:
     *         description: Successfully deleted the post inside the specified thread
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not delete the post
     *       404:
     *         description: The post does not exist in the thread
     */
    .delete(db.deletePost)
    /**
     * @swagger
     *
     * /pages/Post:
     *   put:
     *     description: Update the contents of an existing post
     *     tags:
     *       - Post
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: post_id
     *         description: The id of the post being updated
     *         in: formData
     *         required: true
     *         type: integer    
     *       - name: thread_id
     *         description: The id of the thread the post belongs to
     *         in: formData
     *         required: true
     *         type: integer
     *       - name: content
     *         description: The new content of the post
     *         in: formData
     *         required: true
     *         type: string
     *     responses:
     *       200:
     *         description: Successfully update the contents of the post
     *       500:
     *         description: Internal server error
     *       400:
     *         description: Could not update the post's contents
     *       404:
     *         description: Post does not exists in database 
     */
    .put(db.updatePost)


module.exports = router;
const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const {protect}= require('../middleware/authMiddleware'); //IMporting the middleware(security)

//---PUBLIC ROUTES
// GET(for all posts)
router.get('/', postController.getAllPosts);
//GET (for finding posts by ID)
router.get('/:id', postController.getPost, postController.getPostById);

// POST
router.post('/', postController.createPost);

// Routes for a single post (by ID)

// GET 
router.get('/:id', postController.getPost, postController.getPostById);

// PATCH 
router.patch('/:id', postController.getPost, postController.updatePost);

// DELETE 
router.delete('/:id', postController.getPost, postController.deletePost);

module.exports = router;

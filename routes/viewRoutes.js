const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');

// --- Main Page ---
// GET / - Home page, shows all posts
router.get('/', postController.getAllPosts);

// --- Post-Related Views ---
// IMPORTANT: The '/posts/new' route must come BEFORE the '/posts/:id' route
// GET /posts/new - Show the form to create a new post
router.get('/posts/new', postController.getCreatePostForm);

// NEW: GET /posts/:id/edit - Show the form to edit a post
router.get('/posts/:id/edit', postController.getEditPostForm);

// NEW: POST /posts/:id/edit - Handle the submission of the edit form
router.post('/posts/:id/edit', postController.updatePost);

// GET /posts/:id - Show a single post
router.get('/posts/:id', postController.getPostById);


// --- Auth-Related Views ---
// GET /register - Show the registration page
router.get('/register', authController.getRegisterPage);

// GET /login - Show the login page
router.get('/login', authController.getLoginPage);

// GET /logout - Handle user logout
router.get('/logout', authController.logoutUser);

//Delete posts
router.post('/posts/:id/delete', postController.deletePostFromView);
module.exports = router;

//route for profile page
router.get('/author/:authorId', postController.getPostsByAuthor);

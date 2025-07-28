const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// POST (creating a comment)
router.post('/posts/:id/comments', commentController.createComment);

module.exports = router;

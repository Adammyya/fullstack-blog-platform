const Post = require('../models/Post');
const Comment = require('../models/Comment');

const createComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    const comment = new Comment({
      text: req.body.commentText,
      author: req.session.user.id,
      post: req.params.id
    });

    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    req.flash('success_msg', 'Comment added successfully!');
    res.redirect(`/posts/${req.params.id}`);
  } catch (error) {
    console.error(error);
    req.flash('error_msg', 'Error adding comment. Please try again.');
    res.redirect(`/posts/${req.params.id}`);
  }
};

module.exports = { createComment };

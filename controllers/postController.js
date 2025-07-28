const Post = require('../models/Post');
const User = require('../models/User');

// --- Middleware for API Routes ---

async function getPost(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: 'Cannot find post' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
  res.post = post;
  next();
}

// --- Controller Functions for Rendering Views ---

// GET / - Show all posts on the homepage
const getAllPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get page number from query, default to 1
    const postsPerPage = 5; // Set how many posts to show per page

    const totalPosts = await Post.countDocuments(); // Get the total number of posts

    const posts = await Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * postsPerPage) // Skip posts on previous pages
      .limit(postsPerPage); // Limit to the number of posts for the current page, ells the database to only fetch 5 posts.

    res.render('posts', {
      posts: posts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / postsPerPage)
    });
  } catch (error) {
    console.error("Error in getAllPosts:", error);
    res.status(500).send("A server error occurred while fetching posts.");
  }
};


// GET /posts/:id - Show a single, specific post
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name')
      .populate({
        path: 'comments',
        populate: {
          path: 'author',
          select: 'name'
        }
      });

    if (post == null) { /* ... */ }
    res.render('single-post', { post: post });
  } catch (error) { /* ... */ }
};


// GET /posts/new - Show the form to create a new post
const getCreatePostForm = (req, res) => {
  if (!req.session.user) {
      req.flash('error_msg', 'Please log in to create a post.');
      return res.redirect('/login');
  }
  res.render('create-post');
};

// GET /posts/:id/edit - Show the form to edit an existing post
const getEditPostForm = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
        req.flash('error_msg', 'Post not found.');
        return res.redirect('/');
    }
    if (!req.session.user || req.session.user.id.toString() !== post.author.toString()) {
        req.flash('error_msg', 'You are not authorized to edit this post.');
        return res.redirect('/');
    }
    res.render('edit-post', { post: post });
  } catch (error) {
    res.redirect('/');
  }
};


// --- Controller Functions for Handling Form Submissions & API requests ---

// POST /posts - Handle the creation of a new post from the form
const createPost = async (req, res) => {
  const { title, content } = req.body;
  try {
    if (!req.session.user) {
        req.flash('error_msg', 'You must be logged in to create a post.');
        return res.redirect('/login');
    }
    const post = new Post({
      title: title,
      content: content,
      author: req.session.user.id
    });
    await post.save();
    req.flash('success_msg', 'Post created successfully!');
    res.redirect('/');
  } catch (error) {
    req.flash('error_msg', 'Something went wrong. Please try again.');
    res.redirect('/posts/new');
  }
};

// POST /posts/:id/edit - Handle the update of an existing post from the form
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            req.flash('error_msg', 'Post not found.');
            return res.redirect('/');
        }
        if (!req.session.user || req.session.user.id.toString() !== post.author.toString()) {
            req.flash('error_msg', 'You are not authorized to edit this post.'); //flash message
            return res.redirect('/');
        }
        post.title = req.body.title;
        post.content = req.body.content;
        await post.save();
        req.flash('success_msg', 'Post updated successfully!');
        res.redirect(`/posts/${req.params.id}`);
    } catch (error) {
        req.flash('error_msg', 'Error updating post.'); //flashmessage
        res.redirect(`/posts/${req.params.id}/edit`);
    }
};

// POST /posts/:id/delete - Handle deleting a post from a view
const deletePostFromView = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            req.flash('error_msg', 'Post not found.');
            return res.redirect('/');
        }
        if (!req.session.user || req.session.user.id.toString() !== post.author.toString()) {
            req.flash('error_msg', 'You are not authorized to delete this post.');
            return res.redirect('/');
        }
        await post.deleteOne();
        req.flash('success_msg', 'Post deleted successfully!');
        res.redirect('/');
    } catch (error) {
        req.flash('error_msg', 'Error deleting post.');
        res.redirect('/');
    }
};

// DELETE /api/posts/:id - Handle deleting a post (API only)
const deletePost = async (req, res) => {
  try {
    await res.post.deleteOne();
    res.json({ message: 'Deleted Post' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getPostsByAuthor = async (req, res) => {
  try {
    // We need to find the author first to display their name
    const author = await User.findById(req.params.authorId);
    if (!author) {
      req.flash('error_msg', 'Author not found.');
      return res.redirect('/');
    }

    const posts = await Post.find({ author: req.params.authorId })
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.render('author-posts', { posts: posts, authorName: author.name });
  } catch (error) {
    req.flash('error_msg', 'Could not retrieve posts.');
    res.redirect('/');
  }
};

module.exports = {
  getPost,
  getAllPosts,
  getPostById,
  getCreatePostForm,
  getEditPostForm,
  createPost,
  updatePost,
  deletePost,
  deletePostFromView,
  getPostsByAuthor
};
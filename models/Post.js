const mongoose = require('mongoose');

// A Schema defines the structure of a document in a collection
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
    trim: true     
  },
  content: {
    type: String,
    required: true
  },
  author: {
     type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // user model reference
  },
  createdAt: {
    type: Date,
    default: Date.now 
  },
   comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
});


const Post = mongoose.model('Post', postSchema);



module.exports = Post;
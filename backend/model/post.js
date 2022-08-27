const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  userId: { type: String },
  userName: { type: String },
  like: { type: Number, default: 0 },
  likedBy: [ String ]
});

module.exports = mongoose.model('Post', postSchema);
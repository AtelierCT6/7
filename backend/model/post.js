const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  content: { type: String, required: true },
  imageUrl: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  createDate: {type: Date, default: Date.now()},
  like: { type: Number, default: 0 },
  likedBy: [String],
  moderated: { type: Boolean, default: false }  
});

module.exports = mongoose.model('Post', postSchema);
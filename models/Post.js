const { model, Schema } = require('mongoose');

const PostSchema = new Schema({
  body: String,
  username: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: Date,
      updatedAt: Date,
    },
  ],
  likes: [
    {
      username: String,
      createdAt: Date,
    },
  ],
  createdAt: Date,
  updatedAt: Date,
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
  },
});

module.exports = model('Post', PostSchema);

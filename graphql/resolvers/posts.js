const Post = require('../../models/Post');

const checkAuth = require('../../util/checkAuth');
const { AuthenticationError } = require('apollo-server');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = Post.findById(postId);
        if (!post) {
          throw new Error('Post not found');
        }

        return post;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context);

      const newPost = new Post({
        body,
        username: user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const post = await newPost.save();
      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error('Invalid postId');
        }

        if (!post.username === user.username) {
          throw new AuthenticationError('Not allowed');
        }

        await post.remove();
        return 'Post delete';
      } catch (error) {
        throw new Error(error);
      }

      console.log(newPost);

      const post = await newPost.save();
      return post;
    },
  },
};

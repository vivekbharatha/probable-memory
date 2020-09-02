const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/checkAuth');
const { update } = require('../../models/Post');
const { validateBodyInput } = require('../../util/validators');

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

      if (!body) {
        throw new AuthenticationError('Invalid body');
      }

      const newPost = new Post({
        body,
        username: user.username,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const post = await newPost.save();

      context.pubSub.publish('NEW_POST', { newPost: post });

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
    },
    async createComment(_, { postId, body }, context) {
      const { username } = checkAuth(context);

      const { valid, errors } = validateBodyInput({ body });
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const post = await Post.findById(postId);

      if (!post) {
        throw new UserInputError('Invalid postId');
      }

      post.comments.unshift({
        body,
        username,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await post.save();
      return post;
    },
    async deleteComment(_, { postId, commentId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (!post) {
        throw new UserInputError('Invalid postId');
      }

      const commentIndex = post.comments.findIndex((c) => c.id === commentId);

      if (commentIndex === -1) {
        throw new UserInputError('Invalid commentId');
      }

      if (post.comments[commentIndex].username !== username) {
        throw new AuthenticationError('Not allowed');
      }

      post.comments.splice(commentIndex, 1);
      await post.save();
      return post;
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);

      if (!post) {
        throw new UserInputError('Invalid postId');
      }

      const likeIndex = post.likes.findIndex((l) => l.username === username);

      if (likeIndex === -1) {
        post.likes.push({
          username,
          createdAt: new Date(),
        });
      } else {
        post.likes = post.likes.filter((l) => l.username !== username);
      }

      await post.save();
      return post;
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubSub }) => pubSub.asyncIterator('NEW_POST'),
    },
  },
};

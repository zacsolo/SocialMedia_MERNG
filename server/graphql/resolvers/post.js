const Post = require('../../models/Post');

module.exports = {
  Query: {
    getPosts: async () => {
      try {
        const post = await Post.find();
        return post;
      } catch (err) {
        throw new Error(err);
      }
    },
  },
};

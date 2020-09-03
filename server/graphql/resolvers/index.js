const postResolvers = require('./post');
const usersResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...postResolvers.Mutation,
    ...commentsResolvers.Mutation,
  },
};

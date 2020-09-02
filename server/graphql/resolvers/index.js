const postResolvers = require('./post');
const usersResolvers = require('./users');

module.exports = {
  Query: {
    ...postResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
  },
};

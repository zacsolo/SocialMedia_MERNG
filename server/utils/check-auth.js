const { AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../config');

module.exports.checkAuth = (context) => {
  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('bearer ')[1];
    if (token) {
      try {
        const user = jwt.verify(token, SECRET);
        return user;
      } catch (error) {
        throw new AuthenticationError('Invalid or Expired Token');
      }
    }
    throw new Error("Authentication token must be a 'bearer [token]' ");
  }
  throw new Error('Authorization header must be provided');
};

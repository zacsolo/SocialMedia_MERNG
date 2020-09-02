const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { SECRET } = require('../../config');
const { UserInputError } = require('apollo-server');

module.exports = {
  Mutation: {
    register: async (
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) => {
      //-- TODO: Validate user data
      //-- TODO: Make sure user doesnt already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username already taken', {
          errors: {
            username: 'This username is taken',
          },
        });
      }
      //-- TODO: Hash Password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const result = await newUser.save();
      const token = jwt.sign(
        {
          id: result.id,
          email: result.email,
          username: result.username,
        },
        SECRET,
        { expiresIn: '1h' }
      );
      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
  },
};

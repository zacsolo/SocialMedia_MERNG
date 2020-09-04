const { UserInputError } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  validateRegisterInput,
  validateLoginInput,
} = require('../../utils/validators');
const User = require('../../models/User');
const { SECRET } = require('../../config');

const generateToken = (user) => {
  const newUser = {
    id: user.id,
    email: user.email,
    username: user.username,
  };
  return jwt.sign(newUser, SECRET, { expiresIn: '1h' });
};

module.exports = {
  Mutation: {
    login: async (_, { username, password }) => {
      const { errors, valid } = validateLoginInput(username, password);
      const user = await User.findOne({ username });
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', { errors });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        errors.general = 'Wrong Credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }

      const token = generateToken(user);

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },

    register: async (
      _,
      { registerInput: { username, email, password, confirmPassword } }
    ) => {
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError('Username already taken', {
          errors: {
            username: 'This username is taken',
          },
        });
      }

      password = await bcrypt.hash(password, 12);

      const newUser = new User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const result = await newUser.save();
      const token = generateToken(result);
      return {
        ...result._doc,
        id: result._id,
        token,
      };
    },
  },
};

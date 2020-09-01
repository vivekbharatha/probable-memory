const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../../config');
const { validateRegisterInput, validateLoginInput } = require('../../util/validators');
const User = require('../../models/User');

module.exports = {
  Mutation: {
    async login(_, { loginInput: { username, password } }, context, info) {
      const { valid, errors } = validateLoginInput({
        username,
        password,
      });
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const user = await User.findOne({ username });
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User not found', {
          errors,
        });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = 'Invalid credentials';
        throw new UserInputError('Invalid credentials', {
          errors,
        });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, username: user.username },
        SECRET_KEY,
        {
          expiresIn: '1h',
        }
      );

      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      const { valid, errors } = validateRegisterInput({
        username,
        email,
        password,
        confirmPassword,
      });
      if (!valid) {
        throw new UserInputError('Errors', { errors });
      }

      const existsUser = await User.findOne({ username });
      if (existsUser) {
        throw new UserInputError('Username is taken', {
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
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await newUser.save();

      const token = jwt.sign({ id: res.id, email: res.email, username: res.username }, SECRET_KEY, {
        expiresIn: '1h',
      });

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },
  },
};

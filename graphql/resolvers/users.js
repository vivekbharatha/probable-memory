const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const { SECRET_KEY } = require('../../config');
const { validateRegisterInput } = require('../../util/validators');
const User = require('../../models/User');

module.exports = {
  Mutation: {
    async register(
      _,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      // TODO: Validate user data

      const { valid, errors } = validateRegisterInput({
        username,
        email,
        password,
        confirmPassword,
      });
      if (!valid) {
        throw new UserInputError('Errors', errors);
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

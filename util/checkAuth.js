const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server');

const { SECRET_KEY } = require('../config');

module.exports = (context) => {
  const authToken = context.req.headers.authorization;

  if (!authToken) {
    throw new AuthenticationError('Unauthorized');
  }

  try {
    const user = jwt.verify(authToken, SECRET_KEY);
    return user;
  } catch (error) {
    throw new AuthenticationError('Invalid/Expired token');
  }
};

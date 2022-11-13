const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Authorization required');
  }

  try {
    req.user = jwt.verify(token, 'todo-replace-with-env');
  } catch (err) {
    throw new UnauthorizedError('Authorization required');
  }

  next();
};

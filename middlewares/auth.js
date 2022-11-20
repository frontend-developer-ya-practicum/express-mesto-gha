const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    throw new UnauthorizedError('Authorization required');
  }

  try {
    req.user = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
    );
  } catch (err) {
    next(new UnauthorizedError('Authorization required'));
  }

  next();
};

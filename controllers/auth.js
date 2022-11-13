const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/users');
const HttpCodes = require('../constants/http-status-codes');
const UnauthorizedError = require('../errors/unauthorized');
const ConflictError = require('../errors/conflict');
const BadRequestError = require('../errors/bad-request');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'todo-replace-with-env', {
        expiresIn: '7d',
      });

      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
        })
        .end();
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};

module.exports.register = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((userCreated) => {
      const user = userCreated.toObject();
      delete user.password;
      res.status(HttpCodes.CREATED).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
      } else if (err.code === 11000) {
        next(new ConflictError('User with given email already exists'));
      } else {
        next(err);
      }
    });
};

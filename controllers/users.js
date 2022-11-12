const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const UnauthorizedError = require('../errors/unauthorized');
const ConflictError = require('../errors/conflict');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(new NotFoundError('User with specified id not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Invalid user id'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'todo-replace-with-env',
        { expiresIn: '7d' },
      );

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

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      });
    })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
        return;
      }
      if (err.code === 11000) {
        next(new ConflictError('User with given email already exists'));
        return;
      }
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about } = req.body;
  const options = { new: true, runValidators: true };

  User.findByIdAndUpdate(req.user._id, { name, about }, options)
    .orFail(new NotFoundError('User with specified id not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Invalid user id'));
        return;
      }
      next(err);
    });
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const options = { new: true, runValidators: true };

  User.findByIdAndUpdate(req.user._id, { avatar }, options)
    .orFail(new NotFoundError('User with specified id not found'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
        return;
      }
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Invalid user id'));
        return;
      }
      next(err);
    });
};

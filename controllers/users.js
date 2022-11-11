const mongoose = require('mongoose');
const HttpCodes = require('../constants/http-status-codes');
const User = require('../models/users');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(HttpCodes.NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(HttpCodes.BAD_REQUEST)
          .send({ message: 'Указан некорректный _id пользователя' });
        return;
      }

      res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HttpCodes.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }

      res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const options = { new: true, runValidators: true };

  User.findByIdAndUpdate(req.user._id, { name, about }, options)
    .then((user) => {
      if (!user) {
        res
          .status(HttpCodes.NOT_FOUND)
          .send({ message: 'Пользователь с указанным _id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HttpCodes.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
        return;
      }

      res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const options = { new: true, runValidators: true };

  User.findByIdAndUpdate(req.user._id, { avatar }, options)
    .then((user) => {
      if (!user) {
        res
          .status(HttpCodes.NOT_FOUND)
          .send({ message: 'Пользователь с указанным id не найден' });
        return;
      }
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(HttpCodes.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
        return;
      }

      res
        .status(HttpCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

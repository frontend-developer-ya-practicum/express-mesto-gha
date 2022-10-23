const { StatusCodes } = require('http-status-codes');
const mongoose = require('mongoose');
const Card = require('../models/cards');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Переданы некорректные данные при создании карточки',
        });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: 'Карточка с указанным _id не найдена' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Указан некорректный _id при удалении карточки' });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.likeCard = (req, res) => {
  const updateQuery = { $addToSet: { likes: req.user._id } };
  const options = { new: true, runValidators: true };

  Card.findByIdAndUpdate(req.params.cardId, updateQuery, options)
    .then((card) => {
      if (!card) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Указан некорректный _id карточки' });
        return;
      }

      if (err instanceof mongoose.Error.ValidationError) {
        res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Переданы некорректные данные для постановки лайка',
        });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

module.exports.dislikeCard = (req, res) => {
  const updateQuery = { $pull: { likes: req.user._id } };
  const options = { new: true, runValidators: true };

  Card.findByIdAndUpdate(req.params.cardId, updateQuery, options)
    .then((card) => {
      if (!card) {
        res
          .status(StatusCodes.NOT_FOUND)
          .send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res
          .status(StatusCodes.BAD_REQUEST)
          .send({ message: 'Указан некорректный _id карточки' });
        return;
      }

      if (err instanceof mongoose.Error.ValidationError) {
        res.status(StatusCodes.BAD_REQUEST).send({
          message: 'Переданы некорректные данные для снятия лайка',
        });
        return;
      }

      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send({ message: 'Внутренняя ошибка сервера' });
    });
};

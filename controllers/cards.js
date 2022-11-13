const mongoose = require('mongoose');
const Card = require('../models/cards');
const NotFoundError = require('../errors/not-found');
const BadRequestError = require('../errors/bad-request');
const ForbiddenError = require('../errors/forbidden');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const ownerId = req.user._id;

  Card.create({ name, link, owner: ownerId })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
        return;
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(new NotFoundError('Card with specified id not found'))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Not enough permissions'));
      }
      return card.remove().then(() => res.status(204).end());
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Invalid card id'));
        return;
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  const update = { $addToSet: { likes: req.user._id } };
  const options = { new: true, runValidators: true };

  Card.findByIdAndUpdate(req.params.cardId, update, options)
    .orFail(new NotFoundError('Card with specified id not found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Invalid card id'));
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
        return;
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  const update = { $pull: { likes: req.user._id } };
  const options = { new: true, runValidators: true };

  Card.findByIdAndUpdate(req.params.cardId, update, options)
    .orFail(new NotFoundError('Card with specified id not found'))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Invalid card id'));
        return;
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError(err.message));
        return;
      }
      next(err);
    });
};

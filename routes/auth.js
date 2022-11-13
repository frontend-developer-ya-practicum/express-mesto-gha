const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { REGEX_LINK } = require('../constants/regex');

const { register, login } = require('../controllers/auth');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(REGEX_LINK),
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), register);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().min(8).required(),
  }),
}), login);

module.exports = router;

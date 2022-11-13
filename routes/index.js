const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found');
const { validateRegisterBody, validateLoginBody } = require('../middlewares/validation');
const { register, login } = require('../controllers/auth');

router.post('/signup', validateRegisterBody, register);
router.post('/signin', validateLoginBody, login);

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use((req, res, next) => {
  next(new NotFoundError('Route not found'));
});

module.exports = router;

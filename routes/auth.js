const router = require('express').Router();

const { register, login } = require('../controllers/auth');

router.post('/signup', register);
router.post('/signin', login);

module.exports = router;

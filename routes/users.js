const router = require('express').Router();
const {
  validateUserId,
  validateUserInfoBody,
  validateUserAvatarBody,
} = require('../middlewares/validation');

const {
  getCurrentUser,
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validateUserId, getUser);
router.patch('/me', validateUserInfoBody, updateUserInfo);
router.patch('/me/avatar', validateUserAvatarBody, updateUserAvatar);

module.exports = router;

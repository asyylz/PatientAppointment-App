const express = require('express');
const usersControllers = require('../controllers/usersControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.route('/').delete(usersControllers.deleteUser);
router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);

router.post('/forgotPassword', authControllers.forgotPassword);
router.patch('/resetPassword/:token', authControllers.resetPassword);

router.patch(
  '/updateMyPassword',
  authControllers.protect,
  authControllers.updatePassword
);

router.patch(
  '/updateUser',
  authControllers.protect,
  usersControllers.updateUser
);

router.route('/:id').get(usersControllers.getUser);

router.route('/').get(usersControllers.getAllUsers);

module.exports = router;

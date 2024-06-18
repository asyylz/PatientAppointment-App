const express = require('express');
const usersControllers = require('../controllers/usersControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router.route('/').delete(usersControllers.deleteUser);
router.post('/signup', authControllers.signup);
router.post('/login', authControllers.login);

router.post('/forgotPassword', authControllers.forgotPassword);
//router.patch('/resetPassword/:token', authControllers.resetPassword);

router
  .route('/:id')
  .patch(usersControllers.updateUser)
  .get(usersControllers.getUser);
//router.route('/auth?mode=login').get(usersController.getUser);

router.route('/').get(usersControllers.getAllUsers);

module.exports = router;

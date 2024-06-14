const express = require('express');
const usersControllers = require('../controllers/usersControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();

router.route('/').delete(usersControllers.deleteUser);
router.post('/signup', authController.signup);
//router.post('/login', authController.login);

router
  .route('/:id')
  .patch(usersControllers.updateUser)
  .get(usersControllers.getUser);
//router.route('/auth?mode=login').get(usersController.getUser);

router
  .route('/')
  .get(usersControllers.getAllUsers)
  .post(usersControllers.createUser);
router.route('/login?mode=register').post(usersControllers.createUser);

module.exports = router;

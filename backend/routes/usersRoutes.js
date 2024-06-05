const express = require('express');
const usersController = require('../controllers/usersControllers');

const router = express.Router();

router.route('/').delete(usersController.deleteUser);
router
  .route('/:id')
  .patch(usersController.updateUser)
  .get(usersController.getUser);
//router.route('/auth?mode=login').get(usersController.getUser);

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);
router.route('/login?mode=register').post(usersController.createUser);

module.exports = router;

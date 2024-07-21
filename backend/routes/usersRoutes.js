const express = require('express');
const usersControllers = require('../controllers/usersControllers');
const authControllers = require('../controllers/authControllers');
//const upload = require('./../middlewares/multerConfig');
const { upload, uploadToS3 } = require('./../middlewares/awsConfig');

const router = express.Router();

router.route('/').delete(usersControllers.deleteUser);
router.post(
  '/signup',
  upload.single('image'),
  uploadToS3,
  authControllers.signup
);

router.post('/login', authControllers.login);
router.get('/logout', authControllers.logout);

router.post('/forgotPassword', authControllers.forgotPassword);
router.patch('/resetPassword/:resetToken', authControllers.resetPassword);

router.patch(
  '/updateMyPassword',
  authControllers.protect,
  authControllers.updatePassword
);

router.patch(
  '/updateUser',
  authControllers.protect,
  upload.single('image'),
  uploadToS3,
  usersControllers.updateUser
);
router.delete(
  '/deleteUser',
  authControllers.protect,
  usersControllers.deleteUser
);

router.route('/:id').get(authControllers.protect, usersControllers.getUser);

router.route('/').get(usersControllers.getAllUsers);

module.exports = router;

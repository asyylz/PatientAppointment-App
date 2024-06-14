const express = require('express');
const patientsController = require('../controllers/patientsControllers');
const authController = require('../controllers/authControllers');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, patientsController.getAllPatients)
  .post(authController.protect, patientsController.createPatient);

module.exports = router;

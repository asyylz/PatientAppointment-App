const express = require('express');
const patientsControllers = require('../controllers/patientsControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router
  .route('/')
  .get(authControllers.protect, patientsControllers.getAllPatients)
  .post(authControllers.protect, patientsControllers.createPatient);

router
  .route('/:id')
  .delete(
    authControllers.protect,
    authControllers.restrictTo('admin', 'doctor', 'systemuser'),
    patientsControllers.deletePatient
  );

module.exports = router;

const express = require('express');
const patientsController = require('../controllers/patientsControllers');

const router = express.Router();

router
  .route('/')
  .get(patientsController.getAllPatients)
  .post(patientsController.createPatient);

module.exports = router;

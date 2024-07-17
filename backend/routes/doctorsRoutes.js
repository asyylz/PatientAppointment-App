const express = require('express');
const doctorsController = require('../controllers/doctorsControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router
  .route('/')
  .get(doctorsController.getAllDoctors)
  .post(doctorsController.createDoctor);

router
  .route('/:id')
  .get(authControllers.protect, doctorsController.getDoctor)
  .patch(doctorsController.updateDoctor)
  .delete(doctorsController.deleteDoctor);

module.exports = router;

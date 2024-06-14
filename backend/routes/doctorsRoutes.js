const express = require('express');
const doctorsController = require('../controllers/doctorsControllers');

const router = express.Router();

router
  .route('/')
  .get(doctorsController.getAllDoctors)
  .post(doctorsController.createDoctor);

router
  .route('/:id')
  .get(doctorsController.getDoctor)
  .patch(doctorsController.updateDoctor)
  .delete(doctorsController.deleteDoctor);
module.exports = router;

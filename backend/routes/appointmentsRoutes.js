const express = require('express');
const appointmentsControllers = require('../controllers/appointmentsControllers');
const authControllers = require('../controllers/authControllers');

const router = express.Router();

router
  .route('/')
  .get(authControllers.protect, appointmentsControllers.getAllAppointments)
  .post(authControllers.protect, appointmentsControllers.createAppointment)
  .get(authControllers.protect, appointmentsControllers.getDoctorAppointment);

router
  .route('/:id')
  .delete(authControllers.protect, appointmentsControllers.deleteAppointment)
  .get(authControllers.protect, appointmentsControllers.getPatientAppointments);

module.exports = router;

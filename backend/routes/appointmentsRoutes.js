const express = require('express');
const appointmentsControllers = require('../controllers/appointmentsControllers');

const router = express.Router();

router
  .route('/')
  .get(appointmentsControllers.getAllAppointments)
  .get(appointmentsControllers.getUserAppointment)
  .post(appointmentsControllers.createAppointment)
  .get(appointmentsControllers.getDoctorAppointment);

router.route('/:id').delete(appointmentsControllers.deleteAppointment);

module.exports = router;

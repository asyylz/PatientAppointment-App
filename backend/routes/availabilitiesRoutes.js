const express = require('express');
const availabilitiesControllers = require('../controllers/availabilitiesControllers');

const router = express.Router();

router.route('/:id').get(availabilitiesControllers.getDoctorAvailabilities);

module.exports = router;

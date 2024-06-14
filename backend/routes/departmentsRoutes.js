const express = require('express');
const departmentsControllers = require('../controllers/departmentsControllers');

const router = express.Router();

router
  .route('/')
  .get(departmentsControllers.getAllDepartments)
  .post(departmentsControllers.createDepartment);

module.exports = router;

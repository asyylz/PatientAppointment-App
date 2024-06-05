const express = require('express');
const departmentsController = require('../controllers/departmentsController');

const router = express.Router();

router
  .route('/')
  .get(departmentsController.getAllDepartments)
  .post(departmentsController.createDepartment);

module.exports = router;

const express = require('express');
const professionsController = require('../controllers/professionsController');

const router = express.Router();

router
  .route('/')
  .get(professionsController.getAllProfessions)
  .post(professionsController.createProfession);

module.exports = router;

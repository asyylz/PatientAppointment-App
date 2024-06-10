const express = require('express');
const reviewsController = require('../controllers/reviewsController');

const router = express.Router();

router
  .route('/')
  .get(reviewsController.getDoctorReviews)
  .post(reviewsController.createReview);

module.exports = router;

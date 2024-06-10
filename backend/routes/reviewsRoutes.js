const express = require('express');
const reviewsController = require('../controllers/reviewsController');

const router = express.Router();

router.route('/').post(reviewsController.createReview);
//router.route('/').get(reviewsController.getDoctorReviews);

router.route('/:doctorId').get(reviewsController.getDoctorReviews);

module.exports = router;

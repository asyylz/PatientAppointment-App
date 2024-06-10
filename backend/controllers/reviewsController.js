const Review = require('../models/reviewModel');

// GET ALL //
exports.getDoctorReviews = async (req, res) => {
  const { doctorId } = req.params;
  console.log(doctorId);

  try {
    const reviews = await Review.find({ doctorId });
    //const reviews = await Review.find();
    res.status(200).json({
      status: 'success',
      data: {
        reviews
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createReview = async (req, res) => {
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        review: newReview
      }
    });
  } catch (err) {
    console.log(err);
  }
};

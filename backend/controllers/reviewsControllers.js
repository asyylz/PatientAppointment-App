const mongoose = require('mongoose');
const Review = require('../models/reviewModel');

// GET ALL //
exports.getDoctorReviews = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const reviews = await Review.aggregate([
      { $match: { doctorId: new mongoose.Types.ObjectId(doctorId) } },
      {
        $addFields: {
          averageRating: {
            $avg: [
              '$attributes.staff',
              '$attributes.punctual',
              '$attributes.knowledge'
            ]
          }
        }
      }
    ]);

    const populatedReviews = await mongoose
      .model('User')
      .populate(reviews, { path: 'userId', select: 'name image' });

    //const reviews = await Review.find();
    res.status(200).json({
      status: 'success',
      data: {
        reviews: populatedReviews
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
  console.log('from review contorls', req.body);
  const { userId, doctorId } = req.body;
  const isUserAlreadyCommented = await Review.find({
    userId: userId,
    doctorId: doctorId
  });
  //console.log('userId from post review', isUserAlreadyCommented);
  //console.log('length',isUserAlreadyCommented.length);
  if (isUserAlreadyCommented.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'You have already commented on this doctor!'
    });
  }
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

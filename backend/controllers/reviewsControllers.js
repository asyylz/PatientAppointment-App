const mongoose = require('mongoose');
const Review = require('../models/reviewModel');
const APIFeatures = require('../utils/apiFeatures');
// GET ALL //
exports.getDoctorReviews = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const features = new APIFeatures(
      Review.find({ doctorId }).populate('userId', 'name image'),
      req.query
    )
      .filter()
      .limitFields()
      .paginate()
      .sort();

    const reviews = await features.query;

    // Step 1: Aggregate reviews to calculate average rating and populate userId
    const aggregatedReviews = await Review.aggregate([
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
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          doctorId: 1,
          attributes: 1,
          averageRating: 1,
          'user.name': 1,
          'user.image': 1,
          'user._id': 1
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      length: reviews.length,
      data: {
        reviews: reviews
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

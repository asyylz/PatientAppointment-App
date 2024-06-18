const User = require('../models/userModel');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

// GET ALL //
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: {
        users
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET SINGLE //
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// POST //
exports.createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        user: newUser
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// DELETE //
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(204).json({
      status: 'success',
      data: null
    });
  }
};

// UPDATE //
exports.updateUser = async (req, res, next) => {
  // Create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for  password updated. Please use updateMyPassword',
        400
      )
    );
  }
  try {
    const filteredBody = filterObj(req.body, 'name', 'email');
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser
      }
    });
  } catch (err) {
    next(err);
  }
};

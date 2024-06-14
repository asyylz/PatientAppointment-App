const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const jwt = require('jsonwebtoken');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// POST //
exports.signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });
  } catch (err) {
    next(err);
  }

  //createSendToken(newUser, 201, res);
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
    }
    // // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    // const correct = await user.correctPAssword(password, user.password);

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    next(err);

    //   // 3) If everything ok, send token to client
    //   createSendToken(user, 200, res);
  }
};

exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it is there
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2) Verification token
    if (!token)
      return next(
        new AppError('You are not logged in! Please log in to get access', 401)
      );

    // 3) Check if user still exists

    // 4) Check if user changed password after the JWT was issue
    next();
  } catch (err) {
    next(err);
  }
};

const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const sendEmail = require('./../utils/email');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res, req) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    //secure: true, // in production only
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') {
    cookieOptions.secure = true;
    cookieOptions.sameSite = 'strict';
  }

  res.cookie('jwt', token, cookieOptions);
  user.password = undefined;

  //session
  // req.session = {
  //   email: user.email,
  //   password: user.password
  // };
  // req.session.email = user.email;
  // req.session.password = user.password;
  // req.session.id = user._id;

  // if (req.body.remindMe) {
  //   console.log('from remind me');
  //   req.session.remindMe = req.body.remindMe;
  //   req.sessionOptions.maxAge = 1000 * 60 * 60 * 24 * 3;
  // }

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

/* ----------------------- SIGNUP ----------------------- */
exports.signup = async (req, res, next) => {
  let imagePath;
  console.log('from signup controller', req.file);
  // if (req.file) {
  //   imagePath = `/userProfileImages/${req.file.filename}`;
  // } else {
  //   imagePath = `/userProfileImages/userDefaultAvatar.png`;
  // }
  console.log(req.fileLocation);

  if (req.fileLocation) {
    imagePath = req.fileLocation;
  } else {
    imagePath = `userDefaultAvatar.png`;
  }

  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      policy: req.body.policy,
      DOB: req.body.DOB,
      image: imagePath
    });

    createSendToken(newUser, 201, res);
  } catch (err) {
    next(err);
  }
};

/* ------------------------ LOGIN ----------------------- */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //const { email, password } = req.body.data;
    console.log(email, password);

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

    createSendToken(user, 200, res, req);
  } catch (err) {
    next(err);
  }
};

/* ----------------------- LOGOUT ----------------------- */
// Logout handler
exports.logout = async (req, res, next) => {
  let token;
  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      // console.log('logout', token);
    }

    // res.cookie('jwt', '', {
    //   expires: new Date(Date.now() + 10 * 1000), // expire cookie in 10 seconds
    //   httpOnly: true
    // });
    //req.session = null;
    res.status(200).json({ status: 'success' });
  } catch (err) {
    next(err);
  }
};

/* ----------------------- PROTECT ---------------------- */
exports.protect = async (req, res, next) => {
  // 1) Getting token and check of it is there
  let token;
  // console.log('from protect', req.headers);

  try {
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token)
      return next(
        new AppError('You are not logged in! Please log in to get access', 401)
      );

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token is no longer exist', 401)
      );
    }
    // 4) Check if user changed password after the JWT was issue
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          'User recently changed password! Please log in again.',
          401
        )
      );
    }

    req.user = currentUser;
    //console.log(req.body);

    next();
  } catch (err) {
    next(err);
  }
};
/* --------------------- RESTRICTTO --------------------- */
exports.restrictTo = (...roles) => {
  // roles [ "admin","lead-guide"]
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You have no permisson to perform this action', 403)
      );
    }
    next();
  };
};
/* ------------------- FORGOT PASSWORD ------------------ */
exports.forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(req.body.email);

  if (!user) {
    return next(new AppError('There is no user with this email address', 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //await user.save();

  // const resetURL = `${req.protocol}://${req.get(
  //   'host'
  // )}/resetPassword/${resetToken}`;
  const resetURL = `${process.env.FRONTEND_URL}/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 minutes)',
      message
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
};
/* ------------------- RESET PASSWORD ------------------- */
exports.resetPassword = async (req, res, next) => {
  console.log('from reset password', req.body);
  console.log('from reset password', req.params);

  try {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });
    //console.log(user);
    if (!user) {
      return next(
        new AppError('Password reset link is invalid or has expired', 400)
      );
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  } catch (err) {
    next(err);
  }
};

/* ------------------- UPDATE PASSWORD ------------------ */
exports.updatePassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  console.log('from updatePassword', req.user.id);

  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(oldPassword))) {
    return next(new AppError('Current password of user is not match', 401));
  }
  user.password = newPassword;
  user.passwordConfirm = confirmNewPassword;
  await user.save();
  createSendToken(user, 200, res);
};

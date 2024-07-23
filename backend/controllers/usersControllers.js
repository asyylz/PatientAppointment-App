//const fs = require('fs');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const {
  deleteObjectByDateKeyNumber
} = require('../utils/deleteObjectByKeyNumberS3Bucket');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

function extractDateNumber(url) {
  const regex = /\/(\d+)-/; // Regex to find numbers between '/' and '-'
  const match = url.match(regex); // Match the regex with the given URL
  if (match) {
    return match[1]; // Return the first captured group
  }
  return null; // Return null if no match is found
}

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
exports.deleteUser = async (req, res, next) => {
  console.log(req.user.id);
  try {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE //
exports.updateUser = async (req, res, next) => {
  console.log('from req.file', req.file);

  const user = await User.findById(req.user._id);

  let imagePath;
  // if (req.file && user.image !== '/userProfileImages/userDefaultAvatar.png') {
  //   fs.unlink(`./public${user.image}`, err => console.log(err));
  //   imagePath = `/userProfileImages/${req.file.filename}`;
  // }
  //console.log('from user update for aws', req.body);
  //console.log('from user update for filename', req.fileName);
  const identifierForImage = extractDateNumber(user.image);
  console.log(identifierForImage);
  //1721592559810

  if (req.fileLocation && user.image !== 'userDefaultAvatar.png') {
    await deleteObjectByDateKeyNumber(identifierForImage);
    imagePath = req.fileLocation;

    // const input = {
    //   // DeleteObjectRequest
    //   Bucket: 'patient-appointment-system', // required
    //   Key: 'STRING_VALUE' // required
    //   // MFA: 'STRING_VALUE',
    //   // VersionId: 'STRING_VALUE',
    //   // RequestPayer: 'requester',
    //   // BypassGovernanceRetention: true || false,
    //   // ExpectedBucketOwner: 'STRING_VALUE'
    // };
    // const command = new DeleteObjectCommand(input);
    // const response = await client.send(command);
    // { // DeleteObjectOutput
    //   DeleteMarker: true || false,
    //   VersionId: "STRING_VALUE",
    //   RequestCharged: "requester",
    // };

    //fs.unlink(`./public${user.image}`, err => console.log(err));
  }

  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for  password updated. Please use updateMyPassword',
        400
      )
    );
  }

  // Add address to updateFields if present
  if (req.body.address) {
    req.body.address = JSON.parse(req.body.address);
  }

  try {
    const filteredBody = filterObj(
      req.body,
      'name',
      'email',
      'DOB',
      'image',
      'address'
    );
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        ...filteredBody,
        image: imagePath
      },
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

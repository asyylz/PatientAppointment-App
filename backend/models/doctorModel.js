const mongoose = require('mongoose');
const { Schema } = mongoose;
// Define the address schema
const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  prov: {
    type: String,
    required: true
  },
  postal: {
    type: String,
    required: true
  }
});

// Define the attributes schema for reviews
const attributesSchema = new mongoose.Schema({
  staff: {
    type: Number,
    min: 1,
    max: 5
  },
  punctual: {
    type: Number,
    min: 1,
    max: 5
  },
  helpful: {
    type: Number,
    min: 1,
    max: 5
  },
  knowledge: {
    type: Number,
    min: 1,
    max: 5
  }
});

// Define the review schema
const reviewSchema = new mongoose.Schema({
  name: String,
  rating: {
    type: Number,
    required: true,
    default: 0,
    min: 1,
    max: 5
  },
  comments: {
    type: String
  },
  attributes: attributesSchema
});

// Define the availability schema

// Define the main doctor schema
const doctorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'A doctor must be a user']
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: [true, 'A doctor must have a gender'],
    enum: {
      values: ['M', 'F'],
      message: 'Gender is either: male or female'
    }
  },
  image: String,
  phone: {
    type: String,
    required: true
  },
  address: addressSchema,
  reviews: [reviewSchema],
  departmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  doctorDescription: String
  // availabilities: [
  //   {
  //     type: Schema.Types.ObjectId,
  //     ref: 'Availability'
  //   }
  // ]
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;

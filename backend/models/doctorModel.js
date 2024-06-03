const mongoose = require('mongoose');

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
const availabilitySchema = new mongoose.Schema({
  Monday: String,
  Wednesday: String,
  Thursday: String,
  Friday: String
});

// Define the main doctor schema
const doctorSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  image: String,
  availability: availabilitySchema,
  phone: {
    type: String,
    required: true
  },
  address: addressSchema,
  reviews: [reviewSchema]
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;

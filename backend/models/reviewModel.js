const mongoose = require('mongoose');

const { Schema } = mongoose;

const attributesSchema = new Schema({
  staff: { type: Number, required: true },
  punctual: { type: Number, required: true },
  helpful: { type: Number, required: true },
  knowledge: { type: Number, required: true }
});

const reviewSchema = new Schema({
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comments: { type: String }, // Aligning with the JSON data provided earlier
  //doctorId: { type: Schema.Types.ObjectId, ref: 'Doctors' },
  doctorId: { type: String, required: true },
  attributes: attributesSchema // Reference to Attributes model
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

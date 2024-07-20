const mongoose = require('mongoose');

const { Schema } = mongoose;

const attributesSchema = new Schema({
  staff: { type: Number, required: true },
  punctual: { type: Number, required: true },
  helpful: { type: Number, required: true },
  knowledge: { type: Number, required: true }
});

const reviewSchema = new Schema(
  {
    comments: { type: String },
    //doctorId: { type: Schema.Types.ObjectId, ref: 'Doctors' },
    doctorId: { type: mongoose.Types.ObjectId, required: true },
    userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    attributes: attributesSchema // Reference to Attributes model
  },
  {
    collection: 'reviews',
    timestamps: true
  }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

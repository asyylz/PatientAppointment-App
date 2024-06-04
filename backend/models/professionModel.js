const mongoose = require('mongoose');

const professionSchema = new mongoose.Schema({
  professionMain: {
    type: String,
    required: [true, 'Profession field is required'],
    trim: true,
    maxlength: [
      12,
      'Profession field must have less or equal than 80 characters'
    ],
    minlength: [
      8,
      'Profession field must have more or equal than 10 characters'
    ]
  },
  professionSub: {
    type: [String],
    required: [true, 'Profession is required'],
    trim: true,
    maxlength: [12, 'Profession must have less or equal than 80 characters'],
    minlength: [8, 'Profession must have more or equal than 10 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [10, 'Description must have less or equal than 80 characters'],
    minlength: [50, 'Description must have more or equal than 10 characters']
  }
});

const Profession = mongoose.model('Profession', professionSchema);
module.exports = Profession;

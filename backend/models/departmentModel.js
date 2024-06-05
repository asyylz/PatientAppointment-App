const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
  departmentMain: {
    type: String,
    required: [true, 'Department field is required'],
    trim: true,
    maxlength: [
      12,
      'Department field must have less or equal than 80 characters'
    ],
    minlength: [
      8,
      'Department field must have more or equal than 10 characters'
    ]
  },
  departmentSub: {
    type: [String],
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [12, 'Department must have less or equal than 80 characters'],
    minlength: [8, 'Department must have more or equal than 10 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [10, 'Description must have less or equal than 80 characters'],
    minlength: [80, 'Description must have more or equal than 10 characters']
  }
});

const Department = mongoose.model('Department', departmentSchema);
module.exports = Department;

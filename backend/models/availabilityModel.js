const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'An availability must have a doctorId']
  },
  day: {
    type: String,
    trim: true,
    required: [true, 'Day is required']
  },
  time: {
    type: String,
    trim: true,
    required: [true, 'Time is required']
  }
});

const Availability = mongoose.model('Availability', availabilitySchema);
module.exports = Availability;

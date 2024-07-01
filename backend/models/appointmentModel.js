const mongoose = require('mongoose');

// Define the address schema
const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'An appointment must have a doctorId']
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'An appointment must have a patientId']
  },
  appointmentDate: {
    type: Date,
    required: [true, 'An appointment must have a date ']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  time: {
    type: String,
    required: [true, 'An appointment must have a time']
  },
  reason: {
    type: String,
    required: [true, 'You should specify your concerns...']
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;

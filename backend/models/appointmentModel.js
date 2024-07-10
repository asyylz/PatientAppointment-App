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
  appointmentDateAndTime: {
    type: Date,
    required: [true, 'An appointment must have a date and time ']
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  reason: {
    type: String,
    required: [true, 'You should specify your concerns...']
  },
  diagnose: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['completed', 'pending'],
    default: null
  },
  referral: {
    type: Boolean,
    default: false
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;

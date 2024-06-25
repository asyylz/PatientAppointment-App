const mongoose = require('mongoose');

// Define the address schema
const appointmentSchema = new mongoose.Schema({
  doctorId: {
    type: String,
    required: [true, 'An appointment must have a doctorId']
  },
  patientId: {
    type: String,
    required: [true, 'An appointment must have a patientId']
  },
  date: {
    type: Date
    //required: [true, 'An appointment must have a date']
  },
  reason: {
    type: String,
    required: [true, 'An appointment must have a reason']
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;

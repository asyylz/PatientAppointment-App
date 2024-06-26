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
    ref: 'Patient',
    required: [true, 'An appointment must have a patientId']
  },
  departmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Departments',
    required: [true, 'An appointment must have a departmentId']
  },
  subDepartmentName: {
    type: String,
    ref: 'Departments'
    //required: [true, 'An appointment must have a subDepartmentName']
  },
  date: {
    type: Date
    //required: [true, 'An appointment must have a date and time']
  },
  time: {
    type: String
    //required: [true, 'An appointment must have a date and time']
  },
  reason: {
    type: String,
    required: [true, 'An appointment must have a reason']
  }
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;

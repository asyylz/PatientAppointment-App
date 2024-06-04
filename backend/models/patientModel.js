const mongoose = require('mongoose');

// Define the medicalRecord schema
const medicalSchema = new mongoose.Schema({
  doctor: {
    type: String,
    required: true
  },
  doctorId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: {
      values: ['upcoming', 'closed']
    }
  }
});

// Define the appointment schema
const appointmentSchema = new mongoose.Schema({
  doctor: {
    type: String,
    required: true
  },
  doctorId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: {
      values: ['upcoming', 'closed']
    }
  }
});

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: [
      {
        // This validator checks if the email contains the '@' character
        validator: function(val) {
          return val.includes('@');
        },
        message: 'Email should contain @ character'
      },
      {
        // This validator checks if the email is not empty
        validator: function(val) {
          return val.trim().length > 0;
        },
        message: 'Email is empty'
      },
      {
        // This validator uses a regular expression to check if the email is valid
        validator: function(val) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(val);
        },
        message: 'Invalid email format'
      }
    ]
  },
  age: Number,
  gender: {
    type: String,
    required: true,
    enum: ['male', 'female', 'other']
  },
  blood_type: {
    type: String,
    required: true,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: 'You must enter a blood type'
    }
  },
  adress: {
    type: String,
    required: true,
    trim: true,
    maxlength: [12, 'Adress must have less or equal than 80 characters'],
    minlength: [8, 'Adress must have more or equal than 10 characters']
  },
  appointments: appointmentSchema,
  medicalRecords: medicalSchema
});

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient;

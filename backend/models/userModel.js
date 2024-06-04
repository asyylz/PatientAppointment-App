const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, 'Password is required'],
    trim: true,
    maxlength: [12, 'Password must have less or equal than 40 characters'],
    minlength: [8, 'Password must have more or equal than 10 characters'],
    validate: {
      validator: function(val) {
        const hasUpperCase = /[A-Z]/.test(val);
        const hasLowerCase = /[a-z]/.test(val);
        const hasDigit = /\d/.test(val);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(val);

        return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
      },
      message:
        'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character'
    }
  },
  role: {
    type: String,
    enum: ['doctor', 'systemuser', 'patient'],
    default: 'patient',
    required: true
  }
});

const Usermodel = mongoose.model('User', userSchema);

module.exports = {
  Usermodel
};

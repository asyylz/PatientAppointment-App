const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: [
      {
        validator: function(val) {
          return val.includes('@');
        },
        message: 'Email should contain @ character'
      },
      {
        validator: function(val) {
          return val.trim().length > 0;
        },
        message: 'Email is empty'
      },
      {
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
    maxlength: [40, 'Password must have less or equal than 40 characters'],
    minlength: [8, 'Password must have more or equal than 8 characters'],
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

const User = mongoose.model('User', userSchema);

module.exports = User;

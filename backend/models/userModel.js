const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: [
      // {
      //   validator: function(val) {
      //     return val.includes('@');
      //   },
      //   message: 'Email should contain @ character'
      // },
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
    minlength: [4, 'Password must have more or equal than 8 characters'],
    // validate: {
    //   validator: function(val) {
    //     const hasUpperCase = /[A-Z]/.test(val);
    //     const hasLowerCase = /[a-z]/.test(val);
    //     const hasDigit = /\d/.test(val);
    //     const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(val);

    //     return hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
    //   },
    //   message:
    //     'Password must include at least one uppercase letter, one lowercase letter, one digit, and one special character'
    // }
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords are not the same!'
    }
  },
  role: {
    type: String,
    enum: ['doctor', 'systemuser', 'patient', 'admin'],
    default: 'patient',
    required: true
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
  // active: {
  //   type: Boolean,
  //   default: true,
  //   select: false
  // }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// userSchema.methods.correctPassword = async function(
//   candidatePassword,
//   userPassword
// ) {
//   return await bcrypt.compare(candidatePassword, userPassword);
// };

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  //False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

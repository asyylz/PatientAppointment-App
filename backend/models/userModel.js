const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  town: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  }
});

const userSchema = new mongoose.Schema(
  {
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
      minlength: [4, 'Password must have more or equal than 8 characters'],
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
      },
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
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false
    },
    policy: {
      type: Boolean,
      required: true
    },
    DOB: Date,
    image: {
      type: String,
      trim: true
    },
    address: addressSchema
  },
  {
    collection: 'users',
    timestamps: true
  }
);

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// userSchema.post('update', async function(req, res, next) {
//   console.log('from image');
//   if (this.image.isModified) {
//     fs.unlink(`/userProfileImages/${req.file.filename}`);
//   }
//   next();
// });

// let oldImagePath;

// userSchema.pre('findOneAndUpdate', async function(next) {
//   try {
//     const user = await this.model.findOne(this.getQuery());
//     if (user) {
//       oldImagePath = user.image;
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// userSchema.post('findOneAndUpdate', async function(doc, next) {
//   if (doc && doc.image !== oldImagePath && oldImagePath) {
//     const imagePath = path.join(
//       __dirname,
//       `/userProfileImages/${oldImagePath}`
//     );
//     fs.unlink(imagePath, err => {
//       if (err) {
//         console.error(`Failed to delete old image: ${err}`);
//       } else {
//         console.log(`Successfully deleted old image: ${oldImagePath}`);
//       }
//     });
//   }
//   next();
// });

userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

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

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    required: [true, 'Please provide your role'],
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'password must contain more than 8 characters'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: 'passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
  resetToken: String,
  expiresResetToken: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatepassword,
  userpassword,
) {
  return await bcrypt.compare(candidatepassword, userpassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChanged.getTime() / 1000,
      10,
    );

    return JWTTimeStamp < changedTimeStamp;
  }
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.resetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.expiresResetToken = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;

const mongoose = require('mongoose');

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
  pasword: {
    type: String,
    required: [true, 'Please provide a pasword'],
    minLength: [8, 'Pasword must contain more than 8 characters'],
    select: false,
  },
  paswordConfirm: {
    type: String,
    required: [true, 'Please confirm your pasword'],
    validate: {
      validator: function (el) {
        return el === this.pasword;
      },
      message: 'Paswords are not the same!',
    },
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;

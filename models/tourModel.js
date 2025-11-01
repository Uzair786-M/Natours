const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Tour must contain a name'],
  },
  duration: {
    type: Number,
    required: [true, 'Tour must contain duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'Tour must contain group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'Tour must contain difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  summary: {
    type: String,
    required: [true, 'Tour must contain a Summary'],
  },
  description: {
    type: String,
    required: [true, 'Tour must contain description'],
  },
  price: {
    type: Number,
    required: [true, 'Tour must contain a Price'],
  },
  imageCover: String,
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [String],
});

module.exports = Tour = mongoose.model('Tour', tourSchema);

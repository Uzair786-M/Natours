const mongoose = require('mongoose');

const reviewSchmea = new mongoose.Schema(
  {
    review: { type: String, required: [true, 'There should be one review'] },
    rating: {
      type: Number,
      required: [true, 'There should be rating from 1 to 5'],
      min: 1,
      max: 5,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: [{ type: mongoose.Schema.ObjectId, ref: 'Tour' }],
    users: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchmea.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'users',
    select: 'name photo',
  });
  next();
});
module.exports = Review = mongoose.model('Review', reviewSchmea);

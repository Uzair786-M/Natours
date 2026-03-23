const mongoose = require('mongoose');
const Tour = require('./tourModel');
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
    tour: { type: mongoose.Schema.ObjectId, ref: 'Tour' },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchmea.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // }).populate({
  //   path: 'users',
  //   select: 'name photo',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

reviewSchmea.statics.calcAverageRating = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].nRating,
  });
};

reviewSchmea.post('save', function () {
  this.constructor.calcAverageRating(this.tour);
});

module.exports = Review = mongoose.model('Review', reviewSchmea);

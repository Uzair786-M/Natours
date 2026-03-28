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

// Setting compound index to prevent duplicate reviews

reviewSchmea.index({ tour: 1, user: 1 }, { unique: true });

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

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
  }
  console.log(stats);
};

reviewSchmea.post('save', function () {
  this.constructor.calcAverageRating(this.tour);
});

// Update and delete ratings and nRatings
//findByIdAndUpdate
//findByIdAndDelete

reviewSchmea.pre(/^findOneAnd/, async function (next) {
  this.rew = await this.clone().findOne();

  next();
});

reviewSchmea.post(/^findOneAnd/, async function () {
  await this.rew.constructor.calcAverageRating(this.rew.tour);
});

module.exports = Review = mongoose.model('Review', reviewSchmea);

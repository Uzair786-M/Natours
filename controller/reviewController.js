const Review = require('../models/reviewModel');
const { deleteOne } = require('./handleFactory');

const asyncCatch = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.createReviews = asyncCatch(async (req, res) => {
  // Allow nested Routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  const review = new Review(req.body);
  const result = await review.save();
  res.status(200).json({
    status: 'success',

    data: {
      review: result,
    },
  });
});

exports.getReviews = asyncCatch(async (req, res) => {
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    result: reviews.length,

    reviews,
  });
});

exports.deleteReview = deleteOne(Review);

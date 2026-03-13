const Review = require('../models/reviewModel');

const asyncCatch = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.createReviews = asyncCatch(async (req, res) => {
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
  const reviews = await Review.findOne({ _id: req.params.id });

  res.status(200).json({
    status: 'success',

    reviews,
  });
});

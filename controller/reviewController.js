const Review = require('../models/reviewModel');
const {
  getAll,
  getOne,
  deleteOne,
  updateOne,
  createOne,
} = require('./handleFactory');

// Create Reviews based on tour id params
exports.setTourUserIds = (req, res, next) => {
  // Allow nested Routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

exports.createReviews = createOne(Review);

exports.getReviews = getAll(Review);
exports.getReview = getOne(Review);

exports.deleteReview = deleteOne(Review);
exports.updateReview = updateOne(Review);

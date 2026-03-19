const {
  createReviews,
  getReviews,
  deleteReview,
} = require('../controller/reviewController');
const { protect, restrictTo } = require('../controller/AuthController');

const express = require('express');

const router = express.Router({ mergeParams: true });
router.route('/').post(protect, restrictTo('user'), createReviews);
router.route('/').get(getReviews);
router.route('/deleteReview/:id').delete(deleteReview);

module.exports = router;

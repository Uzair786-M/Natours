const {
  createReviews,
  tourIdParamsMiddleware,
  getReviews,
  updateReview,
  deleteReview,
} = require('../controller/reviewController');
const { protect, restrictTo } = require('../controller/AuthController');

const express = require('express');

const router = express.Router({ mergeParams: true });
router
  .route('/')
  .post(protect, restrictTo('user'), tourIdParamsMiddleware, createReviews);
router.route('/').get(getReviews);
router.route('/updateReview/:id').patch(updateReview);
router.route('/deleteReview/:id').delete(deleteReview);

module.exports = router;

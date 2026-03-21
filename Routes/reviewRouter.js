const {
  createReviews,
  setTourUserIds,
  getReviews,
  getReview,
  updateReview,
  deleteReview,
} = require('../controller/reviewController');
const { protect, restrictTo } = require('../controller/AuthController');

const express = require('express');

const router = express.Router({ mergeParams: true });

// Protect all routes after this middleware
router.use(protect);

router
  .route('/')
  .post(restrictTo('user'), setTourUserIds, createReviews)
  .get(getReviews);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('admin', 'user'), updateReview)
  .delete(restrictTo('admin', 'user'), deleteReview);

module.exports = router;

const {
  getAllTours,
  getTour,
  updateTour,
  updateTourProperty,
  deleteTour,
  createTour,
  tourStats,
  toursSoldPerMonth,
  getToursWithIn,
  getDistances,
} = require('./../controller/tourController');
const { protect, restrictTo } = require('./../controller/AuthController');

const reviewRouter = require('./reviewRouter');

const express = require('express');

const router = express.Router();

// Nested Routes

// POST tour/tourId/reviwe
// OR
// POST tour/tourId/review/reviewId

// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), createReviews);

router.use('/:tourId/reviews', reviewRouter);

router.route('/stats').get(tourStats);
router
  .route('/toursSoldPermonth/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), toursSoldPerMonth);

router
  .route('/tours-within/:distance/center/:latlan/unit/:unit')
  .get(getToursWithIn);

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;

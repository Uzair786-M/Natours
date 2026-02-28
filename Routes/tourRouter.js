const {
  getAllTours,
  getTour,
  updateTour,
  updateTourProperty,
  deleteTour,
  createTour,
  tourStats,
  toursSoldPerMonth,
} = require('./../controller/tourController');
const { protect, restrictTo } = require('./../controller/AuthController');

const express = require('express');

const router = express.Router();

router.route('/').get(protect, getAllTours).post(createTour);

router.route('/stats').get(tourStats);
router.route('/toursSoldPermonth/:year').get(toursSoldPerMonth);

router
  .route('/:id')
  .get(protect, getTour)

  .patch(updateTour)

  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;

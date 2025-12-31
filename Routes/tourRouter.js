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
const { protect } = require('./../controller/AuthController');

const express = require('express');

const router = express.Router();

router.route('/').get(protect, getAllTours).post(createTour);

router.route('/stats').get(tourStats);
router.route('/toursSoldPermonth/:year').get(toursSoldPerMonth);

router
  .route('/:id')
  .get(protect, getTour)

  .patch(updateTour)

  .delete(deleteTour);

module.exports = router;

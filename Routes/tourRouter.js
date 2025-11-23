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

const express = require('express');

const router = express.Router();

router.route('/stats').get(tourStats);
router.route('/toursSoldPermonth/:year').get(toursSoldPerMonth);

router.route('/').get(getAllTours).post(createTour);

router
  .route('/:id')
  .get(getTour)

  .patch(updateTour)

  .delete(deleteTour);

module.exports = router;

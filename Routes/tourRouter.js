const {
  getAllTours,
  getTour,
  updateTour,
  updateTourProperty,
  deleteTour,
  createTour,
  checkId,
  checkBody,
} = require('./../controller/tourController');

const express = require('express');

const router = express.Router();

// router.param('id', checkId);

router.route('/').get(getAllTours).post(createTour);

router
  .route('/:id')
  .get(getTour)

  .patch(updateTour)

  .delete(deleteTour);

module.exports = router;

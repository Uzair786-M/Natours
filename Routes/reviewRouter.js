const { createReviews, getReviews } = require('../controller/reviewController');
const { protect, restrictTo } = require('../controller/AuthController');

const express = require('express');

const router = express.Router();
router.route('/').post(protect, restrictTo('user'), createReviews);
router.route('/:id').get(getReviews);

module.exports = router;

const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
} = require('./../controller/viewController');
const { protect } = require('./../controller/AuthController');

const router = express.Router();

router.get('/', getOverview);
router.get('/tour/:slug', protect, getTour);
router.get('/login', getLoginForm);

module.exports = router;

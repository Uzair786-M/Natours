const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
} = require('./../controller/viewController');
const { isLoggedIn } = require('./../controller/AuthController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

module.exports = router;

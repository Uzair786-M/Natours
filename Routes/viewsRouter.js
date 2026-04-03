const express = require('express');
const { getOverview, getTour } = require('./../controller/viewController');

const router = express.Router();

router.get('/', getOverview);
router.get('/tour', getTour);

module.exports = router;

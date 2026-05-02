const {
  createUsers,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  protect,
  restrictTo,
} = require('./../controller/AuthController');
const {
  getAllUsers,
  getUser,
  updateMe,
  deleteMe,
  deleteUser,

  getMe,
} = require('./../controller/userController');
const { login, logout } = require('../controller/login-logout-Controller');

const express = require('express');

const router = express.Router();

router.route('/Signup').post(createUsers);
router.route('/login').post(login);
router.route('/logout').get(logout);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').patch(resetPassword);

//protect all routes after this middleware

router.use(protect);

// Get login user/myself
router.route('/me').get(getMe, getUser);
router.route('/updateMe').patch(updateMe);
router.route('/updateMyPassword').patch(updateMyPassword);
router.route('/deleteMe').patch(deleteMe);

// Autherize to only Admin after this middleware

router.use(restrictTo('Admin'));

router.route('/').get(getAllUsers).post(createUsers);
router.route('/:id').get(getUser).delete(deleteUser);

module.exports = router;

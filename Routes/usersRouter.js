const {
  createUsers,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  protect,
} = require('./../controller/AuthController');
const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUserByItself,
  deleteUserByAdmin,
  filteredBody,
} = require('./../controller/userController');
const { login } = require('../controller/loginController');
console.log(getAllUsers);
const express = require('express');

const router = express.Router();

router.route('/').get(getAllUsers);
router.route('/updateMe/:id').patch(protect, filteredBody, updateUser);
// router.route('/:id').patch(protect, updateUser).delete(deleteUser);
router.route('/Signup').post(createUsers);
router.route('/Login').post(login);
router.route('/forgotPassword').post(forgotPassword);
router.route('/resetPassword/:token').patch(resetPassword);
router.route('/updateMyPassword').patch(protect, updateMyPassword);

router.route('/deleteMe').patch(protect, deleteUserByItself);
router.route('/deleteByAdmin/:id').delete(deleteUserByAdmin);

module.exports = router;

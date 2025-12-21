const {
  getAllUsers,
  createUsers,
  getUser,
  updateUser,
  deleteUser,
} = require('./../controller/usersController');

const express = require('express');

const router = express.Router();
router.route('/').get(getAllUsers);
router.route('/Signup').post(createUsers);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;

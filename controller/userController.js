const User = require('../models/userModel');
const { deleteOne } = require('./handleFactory');

const asyncCatch = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

const filteredObject = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = asyncCatch(async (req, res, next) => {
  const users = await User.find();
  res.status(201).json({
    status: 'success',
    users,
  });
});

//   (exports.getUser = (req, res) => {
//     res.status(500).json({
//       status: 'error',
//       data: 'Users are not defined yet',
//     });
//   }));

exports.updateUser = asyncCatch(async (req, res, next) => {
  const filteredBody = filteredObject(req.body, 'name', 'email');

  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    runValidators: true,
    new: true,
  });

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

exports.deleteUserByItself = asyncCatch(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  console.log(user);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteUserByAdmin = deleteOne(User);

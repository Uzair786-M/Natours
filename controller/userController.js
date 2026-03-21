const User = require('../models/userModel');
const APIErrors = require('../Utils/apiErrors');
const { getAll, getOne, deleteOne, updateOne } = require('./handleFactory');

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
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};
exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);

exports.updateUser = asyncCatch(async (req, res, next) => {
  // Throw error if user wants to update passwords
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new APIErrors(
        'This route is not for update passwords.Please use /updateMyPassword.',
        400,
      ),
    );
  }

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

exports.deleteMe = asyncCatch(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.user.id, { active: false });
  console.log(user);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);

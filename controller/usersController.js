const User = require('../models/userModel');

const asyncCatch = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
}

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: 'Users are not defined yet',
  });
};

exports.createUsers = asyncCatch(async (req, res) => {
  const newUser = await User.create({
    name:req.body.name,
    email:req.body.email,
    pasword:req.body.pasword,
    paswordConfirm:req.body.paswordConfirm
  })
  res.status(201).json({
    status: 'success',
    data: newUser,
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: 'Users are not defined yet',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: 'Users are not defined yet',
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: 'Users are not defined yet',
  });
};

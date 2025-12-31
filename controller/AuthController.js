const User = require('../models/userModel');
const signToken = require('../Utils/JWTToken').signToken;
const APIError = require('./../Utils/apiErrors');
const jwt = require('jsonwebtoken');

const asyncCatch = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

exports.getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    data: 'Users are not defined yet',
  });
};

exports.createUsers = asyncCatch(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'success',
    token,
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

exports.protect = asyncCatch(async (req, res, next) => {
  let token;

  // 1) Getting token and checking whether it exist
  if (
    req.headers.autherization &&
    req.headers.autherization.startsWith('Bearer')
  ) {
    token = req.headers.autherization.split(' ')[1];
  }

  // 2) If no token exists,sending error in responce
  if (!token) {
    return next(new APIError('Please login to get access', 401));
  }
  // 3) Verify token/decoding token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 4) Grant Access
  req.user = decoded;

  next();
});

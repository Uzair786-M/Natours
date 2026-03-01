const User = require('../models/userModel');
const signToken = require('../Utils/JWTToken').signToken;
const APIError = require('./../Utils/apiErrors');
const jwt = require('jsonwebtoken');
const sendEmail = require('../Utils/email');
const crypto = require('crypto');

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
    role: req.body.role,
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

exports.deleteUser = async (req, res) => {
  res.status(500).json({
    status: 'error',
    data: 'Users are not defined yet',
  });
};

exports.protect = asyncCatch(async (req, res, next) => {
  let token;
  // console.log(req.headers.authorization);
  // 1) Getting token and checking whether it exist
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // 2) If no token exists,sending error in responce
  if (!token) {
    return next(new APIError('Please login to get access', 401));
  }
  // 3) Verify token/decoding token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 4) Verify User still exists/Not deleted by Admin after token issuance

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new APIError('User on this token is no longer exists', 401));
  }

  // 5) Verify password is not changed after issuance of token

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new APIError('User recently Changed password! Please login again', 401),
    );
  }

  // 5) Grant Access
  req.user = currentUser;

  next();
});

exports.restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new APIError('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = asyncCatch(async (req, res, next) => {
  const email = req.body.email;

  const user = await User.findOne({ email });
  // console.log(user);
  // Check if user with this email exist
  if (!user) {
    return next(new APIError('No user found with this email'), 404);
  }

  // Generate Reset Token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // console.log(resetToken);
  // Send token to User via email

  const resetTokenURL = `${req.protocol}//:${req.get('host')}/api/v1/${resetToken}}`;
  const message = `Forgot your password.Use this link to create your new password ${resetTokenURL}.Please ignore this mail if you did not forget your password`;
  try {
    await sendEmail({
      email: user.email,
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token is sent to email',
    });
  } catch {
    user.resetToken = undefined;
    user.expiresResetToken = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new APIError('Internal Server Problem', 500));
  }
});

exports.resetPassword = asyncCatch(async (req, res, next) => {
  // 1) Get the user based on token

  const forgotTokenHashed = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    resetToken: forgotTokenHashed,
    expiresResetToken: { $gt: Date.now() },
  });

  // 2) Check if user exist and token has not expired
  if (!user) {
    return next(new APIError('Your token has been expired', 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.resetToken = undefined;
  user.expiresResetToken = undefined;
  user.save({ validateBeforeSave: false });
  // 3) update passwordChangedAt property

  // 4) Send JWT to for login user
  const token = signToken(user._id);
  res.status(201).json({
    status: 'success',
    token,
  });
});

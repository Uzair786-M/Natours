const User = require('../models/userModel');
const APIErrors = require('../Utils/apiErrors');
const signToken = require('../Utils/JWTToken').signToken;

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new APIErrors('Please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new APIErrors('Incorrect email or password', 401));
  }

  createSendToken(user, 200, res);
};

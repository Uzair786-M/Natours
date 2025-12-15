const APIErrors = require('./../Utils/apiErrors');
const handleCastErrorDB = (error) => {
  let message = `Invalid ${error.path}:${error.value}`;
  return new APIErrors(message, 400);
};

const handleDuplicateNameErrorDB = (err) => {
  const value = err.errmsg.match(/"([^"]*)"/g)[0];

  let message = `Duplicate field name ${value}.Please try another name`;
  return new APIErrors(message, 400);
};

const handleValidationErrorDB = (err) => {
  const value = Object.values(err.errors)
    .map((el) => el.message)
    .join('. ');

  const message = `Invalid input data.${value}`;
  return new APIErrors(message, 400);
};

const sendErrorProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Log error
    console.error('Error 🔥', err);
    // Generic response to client
    res.status(500).json({
      status: 'internal server error',
      message: 'Something went wrong',
    });
  }
};

const sendErrorDev = (err, res) => {
  // Manually setting status and statusCode because Validation errors comes from mongoose and they don't know about those properties.
  // If errors are not coming from our APIError class so we have to manually set them like this.
  err.status = err.status || 'internal server error';
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    // console.log(error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateNameErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProduction(error, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }
};

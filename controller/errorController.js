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

const sendErrorProduction = (err, req, res) => {
  // A) API
  if (req.originalUrl.startsWith('/api')) {
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }

  // B) RENDERED WEBSITE
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error('ERROR 💥', err);
  // 2) Send generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.',
  });
};

// const sendErrorDev = (err, res) => {
//   // Manually setting status and statusCode because Validation errors comes from mongoose and they don't know about those properties.
//   // If errors are not coming from our APIError class so we have to manually set them like this.
//   err.status = err.status || 'internal server error';
//   err.statusCode = err.statusCode || 500;
//   res.status(err.statusCode).json({
//     status: err.status,
//     error: err,
//     message: err.message,
//     stack: err.stack,
//   });
// };

const sendErrorDev = (err, req, res) => {
  // A) API errors
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // B) Errors from frontend (Rendered pages errors)
  console.log('Error', err);
  return res.status(err.statusCode).render('error', {
    title: 'Some thing went wrong',
    msg: err.message,
  });
};

module.exports = (err, req, res, next) => {
  // Manually setting status and statusCode because Validation errors comes from mongoose and they don't know about those properties.
  // If errors are not coming from our APIError class so we have to manually set them like this.
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'production') {
    let error = Object.assign(err);

    // console.log(error);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateNameErrorDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    sendErrorProduction(error, req, res);
  } else if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
};

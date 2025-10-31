const express = require('express');
const tourRouter = require('./Routes/tourRouter');
const usersRouter = require('./Routes/usersRouter');
const morgan = require('morgan');
console.log(process.env.NODE_ENV === 'development');
const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// Serving static files

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from middleware');
  req.requestTime = new Date().toISOString();
  next();
});

/// App routes

// Tour Routes

app.use('/api/v1/tours', tourRouter);

// User Routes

app.use('/api/v1/users', usersRouter);

module.exports = app;

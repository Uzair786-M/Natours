const express = require('express');
const path = require('path');
const tourRouter = require('./Routes/tourRouter');
const usersRouter = require('./Routes/usersRouter');
const reviewsRouter = require('./Routes/reviewRouter');
const viewRouter = require('./Routes/viewsRouter');
const morgan = require('morgan');
// console.log(process.env.NODE_ENV === 'development');
const APIErrors = require('./Utils/apiErrors');
const globalError = require('./controller/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const NoSQLQueryInjectionAttack = require('express-mongo-sanitize');
const XSS = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const app = express();

//setting up pug engine

app.set('view engine', 'pug');
// pointing pug engine to views folder
app.set('views', path.join(__dirname, 'Views'));

// Serving static files

app.use(express.static(path.join(__dirname, 'public')));

// set HTTP security headers
// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
//         scriptSrcElem: ["'self'", 'https://cdn.jsdelivr.net'],
//       },
//     },
//   }),
// );
// Development logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// body parser middleware,read document from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization middleware to prevent NoSQL query injection attack

app.use(NoSQLQueryInjectionAttack());

// Data Sanitizaion agains cross site scripting (XSS).

app.use(XSS());

// rate limit middleware (limit request from one IP to protect again guessing password or emails attack)
const rateLimitObject = {
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this IP,try again later!',
};

app.use(rateLimit(rateLimitObject));

// Preventing Parameter Pollution

app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'ratingsAverage',
      'ratingsQuantity',
      'price',
    ],
  }),
);

app.use((req, res, next) => {
  console.log(req.cookies);
  req.requestTime = new Date().toISOString();
  next();
});

/// App routes

// Pug tempelate Routes

// app.get('/', (req, res) => {
//   res.status(200).render('base');
// });

// View Route

app.use('/', viewRouter);

// Tour Routes

app.use('/api/v1/tours', tourRouter);

// User Routes

app.use('/api/v1/users', usersRouter);

// Review Routes

app.use('/api/v1/reviews', reviewsRouter);

app.all('*', (req, res, next) => {
  next(new APIErrors(`Can't find ${req.originalUrl} in this server`, 404));
});

app.use(globalError);

module.exports = app;

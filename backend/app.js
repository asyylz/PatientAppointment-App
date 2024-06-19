const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const doctorsRouter = require('./routes/doctorsRoutes');
const patientsRouter = require('./routes/patientsRoutes');
const departmentsRouter = require('./routes/departmentsRoutes');
const usersRouter = require('./routes/usersRoutes');
const reviewsRouter = require('./routes/reviewsRoutes');
const globalErrorHandler = require('./controllers/errorControllers');
const AppError = require('./utils/appError');

const app = express();

// Set security HTTP headers
app.use(helmet());

// Limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, please try again  in an hour'
});
app.use('/api', limiter);

// Boody parser , reading data from  body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      '$ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Test middlewares
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

// ROUTES
app.use('/api/v1/doctors', doctorsRouter); // mounting router
app.use('/api/v1/patients', patientsRouter); // mounting router
app.use('/api/v1/departments', departmentsRouter); // mounting router
app.use('/api/v1/users', usersRouter); // mounting router
app.use('/api/v1/reviews', reviewsRouter); // mounting router

module.exports = app;

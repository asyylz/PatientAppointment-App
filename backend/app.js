const express = require('express');
const morgan = require('morgan');

const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const doctorsRouter = require('./routes/doctorsRoutes');
const patientsRouter = require('./routes/patientsRoutes');
const departmentsRouter = require('./routes/departmentsRoutes');
const appointmentsRouter = require('./routes/appointmentsRoutes');
const usersRouter = require('./routes/usersRoutes');
const reviewsRouter = require('./routes/reviewsRoutes');
const availabilitiesRouter = require('./routes/availabilitiesRoutes');
const globalErrorHandler = require('./controllers/errorControllers');
const AppError = require('./utils/appError');

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:4173',
  'http://localhost:3000/api/v1',
  'https://patientappointmentsystem.netlify.app',
  'https://patient-appointment-app-xi.vercel.app'
];

const corsOptions = {
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log(origin);
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Pre-flight requests
app.options('*', cors(corsOptions));

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

// Accept FormData
app.use(express.urlencoded({ extended: false }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.all('/', (req, res) => {
  res.send({
    error: false,
    message: 'Welcome to Patient Appointment System',
    docs: {
      swagger: '/documents/swagger',
      redoc: '/documents/redoc',
      json: '/documents/json'
    },
    user: req.user,
    session: req.session
  });
});

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
//app.use(express.static(`${__dirname}/public`));

//Test middlewares
// app.use((req, res, next) => {
//   //res.setHeader('Access-Control-Allow-Origin', '*');
//   //res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
//   //res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
//   next();
// });

// ROUTES
app.use('/api/v1/doctors', doctorsRouter);
app.use('/api/v1/patients', patientsRouter);
app.use('/api/v1/departments', departmentsRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);
app.use('/api/v1/appointments', appointmentsRouter);
app.use('/api/v1/availabilities', availabilitiesRouter);

app.use('/static', express.static('public'));

//Global Errors
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

const express = require('express');
const morgan = require('morgan');

const app = express();

const doctorsRouter = require('./routes/doctorsRoutes');
const patientsRouter = require('./routes/patientsRoutes');
const departmentsRouter = require('./routes/departmentsRoutes');
const usersRouter = require('./routes/usersRoutes');
const reviewsRouter = require('./routes/reviewsRoutes');

// 1-) MIDDLEWARE
// app.use(morgan('dev'));
app.use(express.json());

app.use(express.static(`${__dirname}/public`));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 2-) ROUTES
app.use('/api/v1/doctors', doctorsRouter); // mounting router
app.use('/api/v1/patients', patientsRouter); // mounting router
app.use('/api/v1/departments', departmentsRouter); // mounting router
app.use('/api/v1/users', usersRouter); // mounting router
app.use('/api/v1/reviews', reviewsRouter); // mounting router

module.exports = app;

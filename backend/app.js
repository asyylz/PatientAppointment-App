const express = require('express');
const morgan = require('morgan');

const app = express();

const doctorsRouter = require('./routes/doctorsRoutes');
const patientsRouter = require('./routes/patientsRoutes');

// 1-) MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next, val) => {
  console.log('Hello from middleware');
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 2-) ROUTES
app.use('/api/v1/doctors', doctorsRouter); // mounting router
app.use('/api/v1/patients', patientsRouter); // mounting router

module.exports = app;

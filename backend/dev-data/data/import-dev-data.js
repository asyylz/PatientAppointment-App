const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./../../models/doctorModel');

dotenv.config({ path: './.env.local' });
const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    //.connect(process.env.DATABASE_LOCAL, {
  })
  .then(() => {
    console.log('DB connection successful!');
  });

// Read File
const doctors = JSON.parse(
  fs.readFileSync(`${__dirname}/doctors.json`, 'utf-8')
);

// Import Data
const importData = async () => {
  try {
    await Doctor.create(doctors);
    console.log('Data Imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete All Data
const deleteData = async () => {
  try {
    await Doctor.deleteMany();
    console.log('Data Deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

console.log(process.argv);

const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Patient = require('../../models/patientModel');

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
const patients = JSON.parse(
  fs.readFileSync(`${__dirname}/patients.json`, 'utf-8')
);

console.log(patients);
// Import Data
const importData = async () => {
  try {
    await Patient.create(patients);
    console.log('Data Imported');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete All Data
const deleteData = async () => {
  try {
    await Patient.deleteMany();
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

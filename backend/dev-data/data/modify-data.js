const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./../../models/doctorModel');
// Load environment variables from .env.local file
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

async function updateDoctors() {
  try {
    const doctors = await Doctor.find({});

    for (let doctor of doctors) {
      if (doctor.name) {
        const [firstName, ...lastNameArray] = doctor.name.split(' ');
        const lastName = lastNameArray.join(' ');

        doctor.firstName = firstName;
        doctor.lastName = lastName;
        doctor.name = undefined;

        await doctor.save();
      }
    }

    console.log('Doctors updated successfully.');
  } catch (err) {
    console.error('Error updating doctors:', err);
  } finally {
    mongoose.connection.close();
  }
}

updateDoctors();

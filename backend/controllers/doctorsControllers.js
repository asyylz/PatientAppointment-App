const mongoose = require('mongoose');
const Doctor = require('../models/doctorModel');
const Availability = require('../models/availabilityModel');
const APIFeatures = require('../utils/apiFeatures');
const { format } = require('morgan');

const { getCurrentWeekDate } = require('./../utils/datesOfTheCurrentWeek');

/* ------------------- ROUTES HANDLERS ------------------ */
// GET ALL // Doctors:sending back to the client
exports.getAllDoctors = async (req, res, next) => {
  try {
    // EXECUTE QUERY //
    const doctorsWithAvailabilities = await mongoose.connection
      .collection('doctorsWithAvailabilities')
      .find()
      .toArray();

    const currentWeekDates = {
      Monday: getCurrentWeekDate('Monday'),
      Tuesday: getCurrentWeekDate('Tuesday'),
      Wednesday: getCurrentWeekDate('Wednesday'),
      Thursday: getCurrentWeekDate('Thursday'),
      Friday: getCurrentWeekDate('Friday'),
      Saturday: getCurrentWeekDate('Saturday'),
      Sunday: getCurrentWeekDate('Sunday')
    };

    //Map over the results and transform availabilities to include current week dates

    const transformedDoctors = doctorsWithAvailabilities.map(doctor => {
      const transformedAvailabilities = doctor.availabilities.map(avail => {
        const { day } = avail;
        return {
          ...avail,
          currentWeekAvailabilityInDateFormat: new Date(
            `${currentWeekDates[day]}T${avail.time}:00.000Z`
          )
        };
      });

      return {
        ...doctor,
        availabilities: transformedAvailabilities
      };
    });

    // Populate departmentId field if necessary
    const populatedDoctors = await mongoose
      .model('Doctor')
      .populate(transformedDoctors, { path: 'departmentId' });

    // SEND RESPONSE //
    res.status(200).json({
      status: 'success',
      results: populatedDoctors.length,
      data: {
        doctors: populatedDoctors
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
    next(err);
  }
};

// GET SINGLE //
exports.getDoctor = async (req, res, next) => {
  try {
    const doctorId = req.params.id;

    // Fetch the doctor document by id
    const doctor = await Doctor.findById(doctorId);

    // If doctor is not found, handle appropriately
    if (!doctor) {
      return res.status(404).json({
        status: 'fail',
        message: 'Doctor not found'
      });
    }
    const doctorWithAvailabilities = await Doctor.findById(doctorId).aggregate([
      {
        $lookup: {
          from: 'availabilities',
          localField: '_id',
          foreignField: 'doctorId',
          as: 'availabilities'
        }
      }
    ]);

    // db.doctors
    //   .aggregate([
    //     {
    //       $lookup: {
    //         from: 'availabilities',
    //         localField: '_id',
    //         foreignField: 'doctorId',
    //         as: 'availabilities'
    //       }
    //     },
    //     {
    //       $project: {
    //         _id: 1,
    //         firstName: 1,
    //         lastName: 1,
    //         gender: 1,
    //         image: 1,
    //         phone: 1,
    //         address: 1,
    //         reviews: 1,
    //         departmentId: 1,
    //         doctorDescription: 1,
    //         availabilities: 1
    //       }
    //     }
    //   ])
    //   .pretty();

    // Fetch availability data for the doctor
    const availability = await Availability.find({ doctorId });

    // Respond with populated data
    res.status(200).json({
      status: 'success',
      data: {
        doctor,
        availability // Include availability data in the response
      }
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE //
exports.updateDoctor = async (req, res, next) => {
  try {
    const updatedDoctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );
    if (updatedDoctor) {
      return res.status(201).json({
        status: 'success',
        data: {
          doctor: updatedDoctor
        }
      });
    }
  } catch (err) {
    next(err);
  }
};

// POST //
exports.createDoctor = async (req, res) => {
  try {
    const newDoctor = await Doctor.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        doctor: newDoctor
      }
    });
  } catch (err) {
    console.log(err);
  }
};

// DELETE //
exports.deleteDoctor = async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(204).json({
      status: 'success',
      data: null
    });
  }
};

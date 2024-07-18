const mongoose = require('mongoose');
const APIFeatures = require('../utils/apiFeatures');
const Doctor = require('../models/doctorModel');
const Availability = require('../models/availabilityModel');
const Review = require('./../models/reviewModel');

const { getCurrentWeekDate } = require('./../utils/datesOfTheCurrentWeek');

/* ------------------- ROUTES HANDLERS ------------------ */
// GET ALL // Doctors:sending back to the client
// exports.getAllDoctors = async (req, res, next) => {
//   try {
//     // EXECUTE QUERY //
//     const doctorsWithAvailabilities = await mongoose.connection
//       .collection('doctorsWithAvailabilities')
//       .find()
//       .toArray();

//     const currentWeekDates = {
//       Monday: getCurrentWeekDate('Monday'),
//       Tuesday: getCurrentWeekDate('Tuesday'),
//       Wednesday: getCurrentWeekDate('Wednesday'),
//       Thursday: getCurrentWeekDate('Thursday'),
//       Friday: getCurrentWeekDate('Friday'),
//       Saturday: getCurrentWeekDate('Saturday'),
//       Sunday: getCurrentWeekDate('Sunday')
//     };

//     //Map over the results and transform availabilities to include current week dates

//     const transformedDoctors = doctorsWithAvailabilities.map(doctor => {
//       const transformedAvailabilities = doctor.availabilities.map(avail => {
//         const { day } = avail;
//         return {
//           ...avail,
//           currentWeekAvailabilityInDateFormat: new Date(
//             `${currentWeekDates[day]}T${avail.time}:00.000Z`
//           )
//         };
//       });

//       return {
//         ...doctor,
//         availabilities: transformedAvailabilities
//       };
//     });

//     // Populate departmentId field if necessary
//     const populatedDoctors = await mongoose
//       .model('Doctor')
//       .populate(transformedDoctors, { path: 'departmentId' });

//     // SEND RESPONSE //
//     res.status(200).json({
//       status: 'success',
//       results: populatedDoctors.length,
//       data: {
//         doctors: populatedDoctors
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err
//     });
//     next(err);
//   }
// };
exports.getAllDoctors = async (req, res, next) => {
  try {
    // const doctors = await Doctor.find().populate(
    //   'departmentId',
    //   'departmentMain'
    // );

    const features = new APIFeatures(
      Doctor.find().populate('departmentId', 'departmentMain'),
      req.query
    )
      .filter()
      .limitFields()
      .paginate()
      .sort();

    const doctors = await features.query;

    // SEND RESPONSE //
    res.status(200).json({
      status: 'success',
      results: doctors.length,
      data: {
        doctors: doctors
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

    // Fetch the doctor document by id and the availabilities concurrently
    const [doctor, availabilities, reviews] = await Promise.all([
      Doctor.findById(doctorId)
        .populate('departmentId')
        .lean(), // Use .lean() to get plain JavaScript object
      Availability.find({ doctorId }),
      Review.find({ doctorId })
        .populate('userId', 'name image')
        .lean()
    ]);

    // If doctor is not found, handle appropriately
    if (!doctor) {
      return res.status(404).json({
        status: 'fail',
        message: 'Doctor not found'
      });
    }

    // Convert days in availabilities collection to current week dates
    const currentWeekDates = {
      Monday: getCurrentWeekDate('Monday'),
      Tuesday: getCurrentWeekDate('Tuesday'),
      Wednesday: getCurrentWeekDate('Wednesday'),
      Thursday: getCurrentWeekDate('Thursday'),
      Friday: getCurrentWeekDate('Friday'),
      Saturday: getCurrentWeekDate('Saturday'),
      Sunday: getCurrentWeekDate('Sunday')
    };

    // Convert doctor's availability dates to Date object and format it to ISO string for comparison
    const availbilitiesInDateFormat = availabilities.map(avail => {
      const { day, time } = avail;
      return {
        ...avail.toObject(), // Convert Mongoose document to plain object
        currentWeekAvailabilityInDateFormat: new Date(
          `${currentWeekDates[day]}T${time}:00.000Z`
        ).toISOString()
      };
    });
    //console.log(availbilitiesInDateFormat);

    // Respond with populated data
    res.status(200).json({
      status: 'success',
      data: {
        ...doctor,
        availabilities: availbilitiesInDateFormat,
        reviews
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

const Appointment = require('../models/appointmentModel');
const Availability = require('../models/availabilityModel');
const APIFeatures = require('../utils/apiFeatures');
const { getWeekDate } = require('./../utils/datesOfTheCurrentWeek');
// GET ALL //
exports.getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find();
    res.status(200).json({
      status: 'success',
      results: appointments.length,
      data: {
        appointments
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET PATIENT APPOINTMENTS //
// exports.getPatientAppointments = async (req, res) => {
//   try {
//     const appointmentsForPatient = await Appointment.find({
//       patientId: req.params.id
//     })
//       .populate('doctorId', { firstName: 1, lastName: 1, departmentId: 1 })
//       .sort({ appointmentDateAndTime: -1 });

//     const totalAppointments = await Appointment.countDocuments({
//       patientId: req.params.id
//     });

//     const today = new Date();
//     const upcomingAppointments = await Appointment.countDocuments({
//       patientId: req.params.id,
//       appointmentDateAndTime: { $gte: today }
//     });

//     res.status(200).json({
//       status: 'success',
//       data: {
//         total: totalAppointments,
//         upcomingAppointments,
//         appointmentsForPatient
//       }
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err
//     });
//   }
// };

// GET PATIENT APPOINTMENTS //
exports.getPatientAppointments = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(
      Appointment.find({
        patientId: req.params.id
      })
        .populate('doctorId', { firstName: 1, lastName: 1, departmentId: 1 })
        .sort({ appointmentDateAndTime: -1 }),
      req.query
    )
      .filter()
      //.sort()
      .limitFields()
      .paginate();

    const appointmentsForPatient = await features.query;

    const totalAppointments = await Appointment.countDocuments({
      patientId: req.params.id
    });

    const today = new Date();
    const upcomingAppointments = await Appointment.countDocuments({
      patientId: req.params.id,
      appointmentDateAndTime: { $gte: today }
    });

    res.status(200).json({
      status: 'success',
      total: appointmentsForPatient.length,
      data: {
        total: totalAppointments,
        upcomingAppointments,
        appointmentsForPatient
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
// GET DOCTOR APPOINTMENTS //
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const appointmentsForDoctor = await Appointment.find({
      doctorId: req.params.id
    })
      .populate('patientId', { name: 1, email: 1, DOB: 1 })
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      status: 'success',
      data: {
        appointmentsForDoctor
      }
    });
  } catch (err) {
    // res.status(404).json({
    //   status: 'fail',
    //   message: err
    // });
    next(err);
  }
};

// UPDATE //
exports.updateAppointment = async (req, res, next) => {
  // First check appointment is in DB
  const appointment = await Appointment.findById(req.params.id);
  if (!appointment) {
    return res
      .status(404)
      .json({ status: 'error', message: 'Appointment not found for updated' });
  }
  //console.log('user appointment update', req.body);

  // Check if appointment date is in  past
  const today = new Date();
  const isPastAppointment =
    new Date(appointment.appointmentDateAndTime) < today;

  if (isPastAppointment && req.user.role !== 'doctor') {
    // If the appointment is in the past and the user is not a doctor, throw an error
    return res.status(400).json({
      status: 'error',
      message: 'You cannot change appointments in the past!'
    });
  }
  const { appointmentDateAndTime } = req.body;

  // Check if  new appointment date is booked already by other patient
  const existingAppointment = await Appointment.findOne({
    doctorId: appointment.doctorId,
    appointmentDateAndTime: appointmentDateAndTime,
    _id: { $ne: req.params.id }
  });

  // if exists  throw error
  if (existingAppointment) {
    return res.status(400).json({
      status: 'error',
      message: 'This slot is already taken, please try another slot'
    });
  }

  // Find doctor's availabilities
  const availabilities = await Availability.find({
    doctorId: appointment.doctorId
  });

  // Generate week dates for current and next weeks
  const generateWeekDates = week => {
    return {
      Monday: getWeekDate('Monday', week),
      Tuesday: getWeekDate('Tuesday', week),
      Wednesday: getWeekDate('Wednesday', week),
      Thursday: getWeekDate('Thursday', week),
      Friday: getWeekDate('Friday', week),
      Saturday: getWeekDate('Saturday', week),
      Sunday: getWeekDate('Sunday', week)
    };
  };

  const currentWeekDates = generateWeekDates('current');
  const nextWeekDates = generateWeekDates('next');

  // Convert doctor's availability dates to Date object and format it to ISO string for comparison
  const availbilitiesInDateFormat = availabilities.map(avail => {
    const { day, time } = avail;
    return {
      ...avail,
      currentWeekAvailabilityInDateFormat: new Date(
        `${currentWeekDates[day]}T${time}:00.000Z`
      ),
      nextWeekAvailabilityInDateFormat: new Date(
        `${nextWeekDates[day]}T${time}:00.000Z`
      )
    };
  });

  // Check if doctor is available on the selected appointment date and time
  if (req.body.appointmentDateAndTime) {
    const appointmentDate = new Date(
      req.body.appointmentDateAndTime
    ).toISOString();

    const isDoctorAvailable = availbilitiesInDateFormat.some(
      avail =>
        avail.currentWeekAvailabilityInDateFormat.toISOString() ===
          appointmentDate ||
        avail.nextWeekAvailabilityInDateFormat.toISOString() === appointmentDate
    );

    if (!isDoctorAvailable) {
      return res.status(400).json({
        status: 'error',
        message: 'Doctor is not available on this date!'
      });
    }
  }

  // Update appointment
  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: 'success',
      data: {
        appointment: updatedAppointment
      }
    });
  } catch (err) {
    next(err);
  }
};

// GET SINGLE //
exports.getDoctorAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        appointment
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      const error = new Error(
        'The appointment with this id could not be found'
      );
      error.statusCode = 404;
      error.status = 'fail';
      return next(error);
    }
    res.status(200).json({
      status: 'success',
      data: {
        appointment
      }
    });
  } catch (err) {
    // res.status(500).json({
    //   status: 'error',
    //   message: err.message
    // });
    next(err);
  }
};

// POST //
exports.createAppointment = async (req, res, next) => {
  // console.log('from createAppointment', req.body);

  const { appointmentDateAndTime, doctorId } = req.body;
  console.log(appointmentDateAndTime);
  try {
    // Check if an appointment with the same date and time already exists
    const existingAppointment = await Appointment.findOne({
      appointmentDateAndTime,
      doctorId
    });

    if (existingAppointment) {
      const error = new Error(
        'This slot already has been booked, please choose another slot.'
      );
      error.statusCode = 409;
      error.status = 'fail';
      return next(error);
    }

    const newAppointment = await Appointment.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        appointment: newAppointment
      }
    });
  } catch (err) {
    // console.log(err.errors.reason.message);
    // res.status(404).json({
    //   status: 'fail',
    //   message: err.errors.reason.message
    //   //message: err.errors.reason.message
    // });
    next(err);
  }
};

// DELETE //
exports.deleteAppointment = async (req, res, next) => {
  //console.log('from deleteAppointment', req.params.id);
  try {
    // First check appointment is in DB
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Appointment not found for updated'
      });
    }

    // Check if appointment date is in  past
    const today = new Date();
    if (new Date(appointment.appointmentDateAndTime) < today) {
      return res.status(400).json({
        status: 'error',
        message: 'You can not delete appointments in past!'
      });
    }
    await Appointment.deleteOne({ _id: req.params.id });
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    console.log('err from delete Appointment', err);
    next(err);
  }
};

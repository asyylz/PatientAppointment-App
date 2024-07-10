const Appointment = require('../models/appointmentModel');

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
exports.getPatientAppointments = async (req, res) => {
  try {
    const appointmentsForPatient = await Appointment.find({
      patientId: req.params.id
    })
      .populate('doctorId', { firstName: 1, lastName: 1, departmentId: 1 })
      .sort({ appointmentDateAndTime: -1 });

    const totalAppointments = await Appointment.countDocuments({
      patientId: req.params.id
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingAppointmentsCount = await Appointment.countDocuments({
      patientId: req.params.id,
      appointmentDate: { $gte: today }
    });

    res.status(200).json({
      status: 'success',
      data: {
        total: totalAppointments,
        upcomingAppointments: upcomingAppointmentsCount,
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
exports.createAppointment = async (req, res) => {
  console.log('from createAppointment', req.body);
  try {
    const newAppointment = await Appointment.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        appointment: newAppointment
      }
    });
  } catch (err) {
    //console.log(err.errors.reason.message);
    res.status(404).json({
      status: 'fail',
      message: err.errors
      //message: err.errors.reason.message
    });
  }
};

// DELETE //
exports.deleteAppointment = async (req, res, next) => {
  console.log('from deleteAppointment', req.params.id);
  try {
    await Appointment.deleteOne({ _id: req.params.id });
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

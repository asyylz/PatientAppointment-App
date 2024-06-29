const Appointment = require('../models/appointmentModel');

// GET ALL //
exports.getAllAppointments = async (req, res, next) => {
  console.log('asiye');
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

// GET SINGLE //
exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.id
    })
      .populate('doctorId', { firstName: 1, lastName: 1 })
      .sort({ appointmentDate: -1 });

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
      total: totalAppointments,
      upcomingAppointments: upcomingAppointmentsCount,
      data: {
        appointments
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
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

// POST //
exports.createAppointment = async (req, res) => {
  console.log('Asiye', req.body);
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
  try {
    await Appointment.findByIdAndUpdate(req.appointment.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

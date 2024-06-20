const Doctor = require('../models/doctorModel');

const {
  getDoctorsWithDepartmentNames
} = require('../utils/aggregationHandler');
const APIFeatures = require('../utils/apiFeatures');

/* ------------------- ROUTES HANDLERS ------------------ */
// GET ALL // Doctors:sending back to the client
exports.getAllDoctors = async (req, res) => {
  try {
    // EXECUTE QUERY //
    const features = new APIFeatures(Doctor.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // Get the enriched doctors data
    const doctors = await getDoctorsWithDepartmentNames(features.query);

    // SEND RESPONSE //
    res.status(200).json({
      status: 'success',
      results: doctors.length,
      data: {
        doctors
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
exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        doctor
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
const Patient = require('../models/patientModel');
const APIFeatures = require('../utils/apiFeatures');

// 1-) ROUTES HANDLERS
// GET Doctors:sending back to the client
exports.getAllPatients = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Patient.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const patients = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: patients.length,
      doctors: {
        patients
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// POST
exports.createPatient = async (req, res, next) => {
  try {
    const newPatient = await Patient.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        patient: newPatient
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.deletePatient = async (req, res, next) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    next(err);
  }
};

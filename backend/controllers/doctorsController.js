const Doctor = require('./../models/doctorModel');

/* ------------------- ROUTES HANDLERS ------------------ */
// GET ALL Doctors:sending back to the client
exports.getAllDoctors = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    console.log(req.query, queryObj);
    const doctors = await Doctor.find(req.query);

    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
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

// GET SINGLE
exports.getDoctor = async (req, res) => {
  console.log(req.params.id);
  try {
    const doctor = await Doctor.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        doctor
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

// UPDATE
exports.updateDoctor = async (req, res) => {
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
          tour: updatedDoctor
        }
      });
    }
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid data set'
    });
  }
};

// POST
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

// DELETE
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

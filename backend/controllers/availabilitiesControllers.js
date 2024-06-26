const Availability = require('../models/availabilityModel');

// GET SINGLE //
exports.getDoctorAvailabilities = async (req, res) => {

  try {
    const availabilities = await Availability.find({ doctorId: req.params.id });
    res.status(200).json({
      status: 'success',
      data: {
        availabilities
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

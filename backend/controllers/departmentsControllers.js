const Department = require('../models/departmentModel');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllDepartments = async (req, res) => {
  try {
    console.log('hello from getalldepartments');
    // EXECUTE QUERY
    const features = new APIFeatures(Department.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const departments = await features.query;
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: departments.length,
      data: {
        departments
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createDepartment = async (req, res) => {
  console.log(req.body);
  try {
    const newDepartment = await Department.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        profession: newDepartment
      }
    });
  } catch (err) {
    console.log(err);
  }
};

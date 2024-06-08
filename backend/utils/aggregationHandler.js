// services/doctorService.js
const mongoose = require('mongoose');
const Doctor = require('../models/doctorModel');

const getDoctorsWithDepartmentNames = async query => {
  const doctors = await Doctor.find(query);

  const doctorIds = doctors.map(doctor => doctor._id);
  const doctorsWithDepartments = await Doctor.aggregate([
    {
      $match: { _id: { $in: doctorIds } }
    },
    {
      $lookup: {
        from: 'departments',
        localField: 'departmentId',
        foreignField: '_id',
        as: 'department'
      }
    },
    {
      $unwind: {
        path: '$department',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $addFields: {
        departmentName: '$department.departmentMain'
      }
    },
    {
      $project: {
        department: 0 // Exclude the department field if you only want the departmentName
      }
    }
  ]);

  return doctorsWithDepartments;
};

module.exports = { getDoctorsWithDepartmentNames };

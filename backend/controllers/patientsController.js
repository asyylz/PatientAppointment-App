const Patient = require('./../models/patientModel');
const APIFeatures = require('./../utils/apiFeatures');

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
exports.createPatient = (req, res) => {
  //console.log(req.body);
  const newId = patients[patients.length - 1].id + 1;
  const newPatient = Object.assign({ id: newId }, req.body);
  patients.push(newPatient);

  fs.writeFile(
    `${__dirname}/../dev-data/data/patients.json`,
    JSON.stringify(patients),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          patient: newPatient
        }
      });
    }
  );
};

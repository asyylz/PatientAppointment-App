const fs = require('fs');

const patients = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/patients.json`)
);

console.log(patients);

// 1-) ROUTES HANDLERS
// GET Doctors:sending back to the client
exports.getAllPatients = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: patients.length,
    data: {
      patients
    }
  });
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

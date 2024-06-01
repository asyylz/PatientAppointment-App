const fs = require('fs');

const doctors = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/doctors.json`)
);

console.log(doctors);

// 1-) ROUTES HANDLERS
// GET Doctors:sending back to the client
exports.getAllDoctors = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: doctors.length,
    data: {
      doctors
    }
  });
};

// POST
exports.createDoctor = (req, res) => {
  //console.log(req.body);
  const newId = doctors[doctors.length - 1].id + 1;
  const newDoctor = Object.assign({ id: newId }, req.body);
  doctors.push(newDoctor);

  fs.writeFile(
    `${__dirname}/dev-data/data/doctors.json`,
    JSON.stringify(doctors),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          doctor: newDoctor
        }
      });
    }
  );
};

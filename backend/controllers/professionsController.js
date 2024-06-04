const Profession = require('./../models/professionModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.getAllProfessions = async (req, res) => {
  try {
    // EXECUTE QUERY
    const features = new APIFeatures(Profession.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const professions = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: professions.length,
      data: {
        professions
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createProfession = async (req, res) => {
  try {
    const newProfession = await Profession.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        profession: newProfession
      }
    });
  } catch (err) {
    console.log(err);
  }
};

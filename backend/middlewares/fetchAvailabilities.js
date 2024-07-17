const mongoose = require('mongoose');
const { getCurrentWeekDate } = require('./../utils/datesOfTheCurrentWeek');

module.exports = {
  fetchAvailabilities: async (req, res, next) => {
    const doctorsWithAvailabilities = await mongoose.connection
      .collection('doctorsWithAvailabilities')
      .find()
      .toArray();
    const currentWeekDates = {
      Monday: getCurrentWeekDate('Monday'),
      Tuesday: getCurrentWeekDate('Tuesday'),
      Wednesday: getCurrentWeekDate('Wednesday'),
      Thursday: getCurrentWeekDate('Thursday'),
      Friday: getCurrentWeekDate('Friday'),
      Saturday: getCurrentWeekDate('Saturday'),
      Sunday: getCurrentWeekDate('Sunday')
    };
    const transformedDoctors = doctorsWithAvailabilities.map(doctor => {
      const transformedAvailabilities = doctor.availabilities.map(avail => {
        const { day } = avail;
        return {
          ...avail,
          currentWeekAvailabilityInDateFormat: new Date(
            `${currentWeekDates[day]}T${avail.time}:00.000Z`
          )
        };
      });

      return {
        ...doctor,
        availabilities: transformedAvailabilities
      };
    });
    req.body.doctors = transformedDoctors;
    next();
  }
};

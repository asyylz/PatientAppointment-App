const moment = require('moment');

// Function to get the date of the current week's day
module.exports = {
  getCurrentWeekDate: day => {
    const daysMap = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4,
      Saturday: 5,
      Sunday: 6
    };
    const today = moment().startOf('isoWeek');
    return today.add(daysMap[day], 'days').format('YYYY-MM-DD');
  }
};

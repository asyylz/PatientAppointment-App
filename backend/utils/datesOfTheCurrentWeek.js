const moment = require('moment');

// Function to get the date of the current week's day
module.exports = {
  getWeekDate: (day, week) => {
    const daysMap = {
      Monday: 0,
      Tuesday: 1,
      Wednesday: 2,
      Thursday: 3,
      Friday: 4,
      Saturday: 5,
      Sunday: 6
    };

    const startOfWeek = moment().startOf('isoWeek'); // Start of the current week

    if (week === 'next') {
      startOfWeek.add(1, 'week'); // Move to the start of next week
    }

    return startOfWeek.add(daysMap[day], 'days').format('YYYY-MM-DD');
  }
};

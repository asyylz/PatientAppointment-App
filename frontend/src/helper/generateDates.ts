// const days = [
//   'Monday',
//   'Tuesday',
//   'Wednesday',
//   'Thursday',
//   'Friday',
//   'Saturday',
//   'Sunday',
// ];

export const getWeekDatesFromToday = (week: 'current' | 'next') => {
  // Get today's date
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const startOfWeek = new Date(today);

  // Calculate the offset for the start of the week based on the parameter
  const weekOffset = week === 'next' ? 1 : 0;

  // Adjust the start of the week to the correct date
  startOfWeek.setDate(
    today.getDate() -
      (currentDayIndex === 0 ? 6 : currentDayIndex - 1) +
      weekOffset * 7
  );

  // Function to add days to a date
  const addDays = (date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  };

  // Array of day names (optional)
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Generate week dates
  const weekDates = days.map((day, index) => {
    const date = addDays(startOfWeek, index);
    const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
    return { date: formattedDate, day };
  });

  return weekDates;
};

export const getFormattedAvailabilityDate = (
  day: string,
  time: string,
  week: 'current' | 'next'
): string => {
  // Array of day names
  const daysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  // Find index of the given day
  const targetDayIndex = daysOfWeek.indexOf(day);
  if (targetDayIndex === -1) {
    throw new Error('Invalid day provided');
  }

  // Get today's date
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 is Sunday, 1 is Monday, etc.

  // Calculate the start of the week
  const startOfWeek = new Date(today);
  startOfWeek.setDate(
    today.getDate() - (currentDayIndex === 0 ? 6 : currentDayIndex - 1)
  );

  // Calculate the week offset
  const weekOffset = week === 'next' ? 1 : 0;

  // Calculate the target date
  const targetDate = new Date(startOfWeek);
  targetDate.setDate(startOfWeek.getDate() + targetDayIndex + weekOffset * 7);

  // Set the time
  const [hours, minutes] = time.split(':').map(Number);

  targetDate.setHours(hours + 1, minutes, 0, 0);

  // Format to ISO string with Z (UTC) timezone
  const isoDateString = targetDate.toISOString();
 // console.log(isoDateString);

  return isoDateString;
};

// export const getWeekDatesFromToday = () => {
//   const today = new Date();
//   const currentDayIndex = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
//   const startOfWeek = new Date(today);

//   // Adjust to start the week from the current day
//   startOfWeek.setDate(
//     today.getDate() - (currentDayIndex === 0 ? 6 : currentDayIndex - 1)
//   );

//   // Function to add days to a date
//   const addDays = (date: Date, days: number) => {
//     const newDate = new Date(date);
//     newDate.setDate(date.getDate() + days);
//     return newDate;
//   };

//   const weekDates = days.map((day, index) => {
//     const date = addDays(startOfWeek, index);
//     const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(
//       date.getMonth() + 1
//     )
//       .toString()
//       .padStart(2, '0')}/${date.getFullYear()}`;
//     return { date: formattedDate, day };
//   });
// console.log(weekDates)
//   return weekDates;
// };

export const convertDateAndTimeStringToDate = (
  dateString: string,
  timeString: string
): Date => {
  // Split time string into hours and minutes
  const [hours, minutes] = timeString.split(':').map(Number);

  // Define a variable to hold the new Date
  let newDate: Date;

  // Check the format of the date string and create a new Date object accordingly
  if (dateString.includes('/')) {
    const [day, month, year] = dateString.split('/').map(Number);
    newDate = new Date(year, month - 1, day, hours + 1, minutes, 0);
  } else {
    const [year, month, day] = dateString.split('-').map(Number);
    newDate = new Date(year, month - 1, day, hours + 1, minutes, 0);
  }

  return newDate;
};

export const formatDateForInput = (dateString: string): string => {
  if (dateString.includes('T')) {
    const parts = dateString.split('T');
    return parts[0];
  }
  const parts = dateString.includes('/')
    ? dateString.split('/')
    : dateString.split('-');

  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

export const dateForCustomInput = (isoString: string) => {
  const dateObj = new Date(isoString);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
export const getDateFromDateString = (dateString: string): string => {
  // console.log(dateString);
  const part = dateString.split('T');
  const parts = part[0].split('-');
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

export const convertToDateandDateString = (
  availabilityDay: string,
  availabilityTime: string
) => {
  // Map days of the week to their index
  const daysOfWeek = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  // Get the current date
  const currentDate = new Date();
  // Get the current week's Monday
  const currentMonday = new Date(
    currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1)
  );

  // Adjust the day of the week to get the specific day's date
  const availabilityDate = new Date(currentMonday);
  availabilityDate.setDate(
    currentMonday.getDate() +
      (Object.keys(daysOfWeek).indexOf(availabilityDay) - 1 || 0)
  );

  // Combine the availability date and time into a single string
  const availabilityDateTimeString = `${
    availabilityDate.toISOString().split('T')[0]
  }T${availabilityTime}:00.000Z`;

  // Create a Date object for the availability
  const availabilityDateTime = new Date(availabilityDateTimeString);

  //console.log(availabilityDateTimeString);
  // Create a Date object for the current date and time
  //const currentDateTime = new Date();

  // Compare the availability date and time with the current date and time
  return { availabilityDateTime, availabilityDateTimeString };
};

/* ---------------------- separate ---------------------- */

export const formatDateForUI = (isoString: string) => {
  //console.log(isoString);
  // Extract the date part from the ISO string
  const datePart = isoString.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);

  // Create a date object using the extracted date components
  const date = new Date(Date.UTC(year, month - 1, day)); // Date.UTC to avoid time zone conversion

  //const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-GB'); // Format as DD/MM/YYYY

  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const dayOfWeek = daysOfWeek[date.getUTCDay()]; // Get the day of the week

  return `${formattedDate} ${dayOfWeek}`;
};

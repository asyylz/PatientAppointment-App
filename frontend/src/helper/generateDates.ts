const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const getWeekDatesFromToday = () => {
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 is Sunday, 1 is Monday, etc.
  const startOfWeek = new Date(today);

  // Adjust to start the week from the current day
  startOfWeek.setDate(
    today.getDate() - (currentDayIndex === 0 ? 6 : currentDayIndex - 1)
  );

  // Function to add days to a date
  const addDays = (date: Date, days: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + days);
    return newDate;
  };

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

export const convertDateStringToDate = (dateString: string): Date => {
  console.log(dateString);
  const [day, month, year] = dateString.split(
    `${dateString.includes('/') ? '/' : '-'}`
  );
  console.log(new Date(Number(year), Number(month) - 1, Number(day)));
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const formatDateForInput = (dateString: string): string => {
  console.log(dateString);
  const parts = dateString.split('/');
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

export const formatDateForInput2 = (dateString: string): string => {
  console.log(dateString);
  const part = dateString.split('T');
  const parts = part[0].split('-');
  return `${parts[0]}-${parts[1]}-${parts[2]}`;
};

export const formatDateForUI = (isoString: string) => {
  // Extract the date part from the ISO string
  const datePart = isoString.split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);

  // Create a date object using the extracted date components
  const date = new Date(Date.UTC(year, month - 1, day)); // Date.UTC to avoid time zone conversion

  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-GB', options); // Format as DD/MM/YYYY

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

export const isPastDate = (
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
  const currentMonday = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay() + 1));

  // Adjust the day of the week to get the specific day's date
  const availabilityDate = new Date(currentMonday);
  availabilityDate.setDate(currentMonday.getDate() + daysOfWeek[availabilityDay] - 1);

  // Combine the availability date and time into a single string
  const availabilityDateTimeString = `${availabilityDate.toISOString().split('T')[0]}T${availabilityTime}:00.000Z`;

  // Create a Date object for the availability
  const availabilityDateTime = new Date(availabilityDateTimeString);

  // Create a Date object for the current date and time
  const currentDateTime = new Date();

  // Compare the availability date and time with the current date and time
  return availabilityDateTime < currentDateTime;
};


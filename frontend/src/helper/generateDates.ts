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
  const [day, month, year] = dateString.split(
    `${dateString.includes('/') ? '/' : '-'}`
  );
  return new Date(Number(year), Number(month) - 1, Number(day));
};

export const formatDateForInput = (dateString: string): string => {
  const parts = dateString.split('/');
  return `${parts[2]}-${parts[1]}-${parts[0]}`;
};

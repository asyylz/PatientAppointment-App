// Function to get day name from index (0 to 6)
const getDayName = (index: number) => {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return days[index];
};

// Function to generate dates dynamically
export const generateDates = (numberOfDays: number) => {
  const dates = [];
  const today = new Date(); // Get today's date

  for (let i = 0; i < numberOfDays; i++) {
    const date = new Date(today.getTime() + i * 24 * 60 * 60 * 1000); // Add i days to today
    const dayName = getDayName(date.getDay()); // Get day name (e.g., "Monday")

    // Format date as "dd/mm/yyyy"
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;

    // Push formatted date and day name to array
    dates.push({
      date: formattedDate,
      day: dayName,
    });
  }

  return dates;
};

// Example usage: Generate dates for the next 7 days
// const numberOfDays = 7;
// const dates = generateDates(numberOfDays);

// console.log(dates);

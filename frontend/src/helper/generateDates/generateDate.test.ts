import {
  getWeekDatesFromToday,
  getFormattedAvailabilityDate,
  convertDateAndTimeStringToDate,
  formatDateForInput,
  dateForCustomInput,
  getDateFromDateString,
  convertToDateandDateString,
} from './generateDates'; // Import the function

describe('getWeekDatesFromToday', () => {
  beforeEach(() => {
    // Mocking Date to control the current date in tests
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2023-09-20T00:00:00Z').getTime());
  });

  afterEach(() => {
    jest.useRealTimers(); // Reset to the real date after each test
  });

  it('1--should return the correct dates for the current week starting from Monday', () => {
    const weekDates = getWeekDatesFromToday('current');
    expect(weekDates).toEqual([
      { date: '18/09/2023', day: 'Monday' },
      { date: '19/09/2023', day: 'Tuesday' },
      { date: '20/09/2023', day: 'Wednesday' },
      { date: '21/09/2023', day: 'Thursday' },
      { date: '22/09/2023', day: 'Friday' },
      { date: '23/09/2023', day: 'Saturday' },
      { date: '24/09/2023', day: 'Sunday' },
    ]);
  });

  it('2--should return the correct dates for the next week starting from Monday', () => {
    const weekDates = getWeekDatesFromToday('next');
    expect(weekDates).toEqual([
      { date: '25/09/2023', day: 'Monday' },
      { date: '26/09/2023', day: 'Tuesday' },
      { date: '27/09/2023', day: 'Wednesday' },
      { date: '28/09/2023', day: 'Thursday' },
      { date: '29/09/2023', day: 'Friday' },
      { date: '30/09/2023', day: 'Saturday' },
      { date: '01/10/2023', day: 'Sunday' },
    ]);
  });

  it('3--should have correct day names in the result', () => {
    const weekDates = getWeekDatesFromToday('current');
    const dayNames = weekDates.map((item) => item.day);
    expect(dayNames).toEqual([
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday',
    ]);
  });
});

describe('getFormattedAvailabilityDate', () => {
  beforeEach(() => {
    // Mocking Date to control the current date in tests
    jest
      .useFakeTimers()
      .setSystemTime(new Date('2023-09-20T10:00:00Z').getTime());
  });

  afterEach(() => {
    jest.useRealTimers(); // Reset to the real date after each test
  });

  it('1--should return the correct ISO date string for a valid input (current week)', () => {
    const result = getFormattedAvailabilityDate(
      'Wednesday',
      '14:00',
      'current'
    );
    expect(result).toEqual('2023-09-20T14:00:00.000Z');
  });

  it('2--should return the correct ISO date string for a valid input (next week)', () => {
    const result = getFormattedAvailabilityDate('Monday', '09:30', 'next');
    expect(result).toEqual('2023-09-25T09:30:00.000Z');
  });

  it('3--should handle Sunday correctly when calculating the target date', () => {
    const result = getFormattedAvailabilityDate('Sunday', '18:45', 'current');
    expect(result).toEqual('2023-09-24T18:45:00.000Z');
  });

  it('4--should return the correct ISO date string for the next week scenario', () => {
    const result = getFormattedAvailabilityDate('Friday', '10:00', 'next');
    expect(result).toEqual('2023-09-29T10:00:00.000Z');
  });

  it('5--should throw an error when an invalid day is provided', () => {
    expect(() => {
      getFormattedAvailabilityDate('Notaday', '12:00', 'current');
    }).toThrow('Invalid day provided');
  });

  it('6--should correctly handle time and time zone conversion', () => {
    const result = getFormattedAvailabilityDate('Thursday', '23:00', 'current');
    expect(result).toEqual('2023-09-21T23:00:00.000Z'); // Adjust for the 1-hour UTC offset
  });
});

describe('convertDateAndTimeStringToDate', () => {
  it('1--should convert a date and time string with DD/MM/YYYY format to a Date object', () => {
    const date = convertDateAndTimeStringToDate('20/09/2023', '14:30');
    expect(date).toEqual(new Date(Date.UTC(2023, 8, 20, 14, 30, 0))); // Month is 0-based, so 8 represents September
  });

  it('2--should convert a date and time string with YYYY-MM-DD format to a Date object', () => {
    const date = convertDateAndTimeStringToDate('2023-09-20', '15:30');
    expect(date).toEqual(new Date(Date.UTC(2023, 8, 20, 15, 30, 0)));
  });

  it('3--should correctly parse the time and add the hour offset', () => {
    const date = convertDateAndTimeStringToDate('20/09/2023', '23:45');
    expect(date).toEqual(new Date(Date.UTC(2023, 8, 20, 23, 45, 0)));
  });

  it('4--should correctly handle leading zeroes in time', () => {
    const date = convertDateAndTimeStringToDate('2023-09-20', '08:05');
    expect(date).toEqual(new Date(Date.UTC(2023, 8, 20, 8, 5, 0)));
  });

  it('5--should handle edge cases like the end of the month', () => {
    const date = convertDateAndTimeStringToDate('31/12/2023', '23:59');
    expect(date).toEqual(new Date(Date.UTC(2023, 11, 31, 23, 59, 0)));
  });

  it('6--should correctly handle leap years', () => {
    const date = convertDateAndTimeStringToDate('29/02/2024', '12:00');
    expect(date).toEqual(new Date(Date.UTC(2024, 1, 29, 12, 0, 0))); // 2024 is a leap year
  });
});

describe('formatDateForInput', () => {
  it('1--Should correctly format a Date string for date type input', () => {
    const date = '12/09/2023';
    const result = formatDateForInput(date);
    expect(result).toEqual('2023-09-12');
  });

  it('2--Should correctly format a Date string for date type input', () => {
    const date = '2023-09-20T14:30:00.000Z';
    const result = formatDateForInput(date);
    expect(result).toEqual('2023-09-20');
  });
});

describe('dateForCustomInput', () => {
  it('1--Should format an ISO string to YYYY-MM-DD format', () => {
    const isoString = '2023-12-31T14:30:00.000Z';
    const formattedDate = dateForCustomInput(isoString);
    expect(formattedDate).toEqual('2023-12-31');
  });

  it('Should handle leading zero for months and days', () => {
    const isoString = '2024-01-05T10:15:00.000Z';
    const formattedDate = dateForCustomInput(isoString);
    expect(formattedDate).toEqual('2024-01-05');
  });

  it('2--Should correctly handle a date with a single-digit month and day', () => {
    const isoString = '2023-03-07T09:45:00.000Z';
    const formattedDate = dateForCustomInput(isoString);
    expect(formattedDate).toEqual('2023-03-07');
  });

  it('3--Should handle leap years correctly', () => {
    const isoString = '2024-02-29T00:00:00.000Z'; // 2024 is a leap year
    const formattedDate = dateForCustomInput(isoString);
    expect(formattedDate).toEqual('2024-02-29');
  });

  it('4--Should correctly convert different ISO strings regardless of the time', () => {
    const isoString = '2023-10-15T23:59:59.999Z';
    const formattedDate = dateForCustomInput(isoString);
    expect(formattedDate).toEqual('2023-10-15');
  });
});
describe('getDateFromDateString', () => {
  it('1--Should format an ISO string to DD/MM/YYYY format', () => {
    const isoString = '2023-12-31T14:30:00.000Z';
    const formattedDate = getDateFromDateString(isoString);
    expect(formattedDate).toEqual('31/12/2023');
  });
});

describe('convertToDateandDateString', () => {
  it('1--Should convert availability day and time to correct date and date string', () => {
    const availabilityDay = 'Wednesday';
    const availabilityTime = '14:30';

    const { availabilityDateTime, availabilityDateTimeString } =
      convertToDateandDateString(availabilityDay, availabilityTime);

    // Expected date is based on the upcoming Wednesday from the current date
    const expectedDate = new Date();
    const currentDay = expectedDate.getUTCDay(); // Use UTC day
    const daysUntilWednesday =
      3 - currentDay < 0 ? 7 + (3 - currentDay) : 3 - currentDay;

    expectedDate.setUTCDate(expectedDate.getUTCDate() + daysUntilWednesday); // Use UTC date
    expectedDate.setUTCHours(14, 30, 0, 0); // Set time in UTC (14:30)

    expect(availabilityDateTime.toISOString()).toBe(expectedDate.toISOString()); // Compare using UTC

    const expectedDateString = `${
      expectedDate.toISOString().split('T')[0]
    }T${availabilityTime}:00.000Z`;
    expect(availabilityDateTimeString).toBe(expectedDateString);
  });
});

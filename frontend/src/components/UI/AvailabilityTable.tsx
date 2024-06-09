import React from 'react';
import classes from './AvailabilityTable.module.css';

interface AvailabilityProps {
  availability: Availability;
}

const timeSlots: string[] = [
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
];
const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const generateTimeSlots = async (startHour: number, endHour: number) => {
  const timeSlots = [];
  let currentHour = startHour;
  let currentMinute = 0;

  while (
    currentHour < endHour ||
    (currentHour === endHour && currentMinute === 0)
  ) {
    // Format the time
    const period = currentHour >= 12 ? 'PM' : 'AM';
    const hour = currentHour % 12 || 12; // Convert to 12-hour format
    const minute = currentMinute === 0 ? '00' : currentMinute;
    timeSlots.push(`${hour}:${minute} ${period}`);

    // Increment time by 30 minutes
    currentMinute += 30;
    if (currentMinute === 60) {
      currentMinute = 0;
      currentHour += 1;
    }
  }

  return timeSlots;
};

const isTimeInRange = async (time: string, range: string) => {
  console.log('Range:', range);

  const [startTime, endTime] = range.split('-');
  console.log('Start Time:', startTime);
  console.log('End Time:', endTime);

  // Declare startTime and endTime as string | number
  let startTimeConverted: string | number = startTime;
  let endTimeConverted: string | number = endTime;

  // Convert startTime to number
  if (typeof startTimeConverted === 'string') {
    startTimeConverted = parseInt(startTimeConverted.replace(/\D/g, ''), 10);
    if (isNaN(startTimeConverted)) {
      console.error('Invalid start time');
    }
  }
  console.log(startTimeConverted);

  if (typeof endTimeConverted === 'string') {
    endTimeConverted = parseInt(endTimeConverted.replace(/\D/g, ''), 10);
    if (isNaN(endTimeConverted)) {
      console.error('Invalid end time');
    }
  }
  console.log(endTimeConverted);
  const timeSlots = await generateTimeSlots(
    startTimeConverted,
    endTimeConverted
  );

  console.log(timeSlots);
  console.log(time);

  const isDoctorAvailable: boolean = timeSlots.some((slot) => time == slot);

  console.log(isDoctorAvailable);
  return isDoctorAvailable;
};
/* ------------------------ MAIN ------------------------ */

const AvailabilityTable: React.FC<AvailabilityProps> = ({ availability }) => {
  return (
    <div className={classes.wrapper}>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            {days.map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {timeSlots.map((slot) => (
            <tr key={slot}>
              <td>{slot}</td>
              {days.map((day) => (
                <td key={day}>
                  {availability[day] && isTimeInRange(slot, availability[day])
                    ? 'ok'
                    : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AvailabilityTable;

import React from 'react';
import classes from './AvailabilityTable.module.css';
import { generateTimeSlots } from '../../utils/timeSlots';
import { mapAvailability } from '../../utils/mapAvailability';

interface AvailabilityProps {
  availability: Availability;
}
const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/* ------------------------ MAIN ------------------------ */

const AvailabilityTable: React.FC<AvailabilityProps> = ({ availability }) => {
  const slots = generateTimeSlots();
  const mappedAvailability = mapAvailability(availability, slots);

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
          {slots.map((slot) => (
            <tr key={slot}>
              <td>{slot}</td>
              {days.map((day) => (
                <td
                  key={day}
                  className={`${
                    mappedAvailability[day]?.[slots.indexOf(slot)] ===
                    'Available'
                      ? classes.available
                      : ''
                  }`}
                >
                  {mappedAvailability[day]?.[slots.indexOf(slot)] || ''}
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

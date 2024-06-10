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
  
  if (!availability) {
    return <div>No availability data for this doctor</div>;
  }

  const mappedAvailability = mapAvailability(availability, slots);


  return (
    <div className={classes.wrapper}>
      {availability && (
        <table className={classes.table}>
          <thead>
            <tr>
              <th className={classes.th}>Time</th>
              {days.map((day) => (
                <th key={day} className={classes.th}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot}>
                <td className={classes.td}>{slot}</td>
                {days.map((day) => (
                  <td
                    key={day}
                    className={`${classes.td} ${
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
      )}
    </div>
  );
};

export default AvailabilityTable;

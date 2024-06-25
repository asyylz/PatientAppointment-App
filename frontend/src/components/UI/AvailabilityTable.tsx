import React, { useState } from 'react';
import classes from './AvailabilityTable.module.css';
import { generateTimeSlots } from '../../utils/timeSlots';
import { mapAvailability } from '../../utils/mapAvailability';
import { generateDates } from '../../helper/GenerateWeekDays';
import { useSelector } from 'react-redux';

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
  const { selectedDoctor } = useSelector((state: RootState) => state.doctors);
  const { userData } = useSelector((state: RootState) => state.currentUser);

  const slots = generateTimeSlots();
  const [appointment, setAppointment] = useState<Appointment>({
    doctorId: {
      $oid: '',
    },
    patientId: {
      $oid: '',
    },
    date: '',
    reason: '',
  });
  console.log(appointment);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.textContent === 'Available'
    ) {
      setAppointment({
        doctorId: selectedDoctor?._id,
        patientId: userData?._id,
        date: '',
        reason: 'General checkup',
      });
    }
  };

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
                    className={`${
                      mappedAvailability[day]?.[slots.indexOf(slot)] ===
                      'Available'
                        ? classes.available
                        : ''
                    }`}
                    onClick={handleClick}
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

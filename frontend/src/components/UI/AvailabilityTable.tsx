import React, { useState } from 'react';
import classes from './AvailabilityTable.module.css';
import { generateTimeSlots } from '../../utils/timeSlots';
import { mapAvailability } from '../../utils/mapAvailability';
import { generateDates } from '../../helper/GenerateWeekDays';
import { useSelector } from 'react-redux';
import ModalCustom from './ModalCustom';
import AppointmentForm from './AppointmentForm';

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
const timeSlots = generateTimeSlots();
console.log(timeSlots);

/* ------------------------ MAIN ------------------------ */
const AvailabilityTable: React.FC<AvailabilityProps> = ({ availability }) => {
  const { selectedDoctor } = useSelector((state: RootState) => state.doctors);
  const { userData } = useSelector((state: RootState) => state.currentUser);
  const slots = generateTimeSlots();
  const [openModal, setOpenModal] = useState<boolean>(false);

  console.log(selectedDoctor?.availabilities);

  // if (!availability) {
  //   return <div>No availability data for this doctor</div>;
  // }

  //const mappedAvailability = mapAvailability(availability, slots);

  return (
    <>
      {openModal && (
        <ModalCustom>
          <AppointmentForm
            user={userData as userData}
            doctor={selectedDoctor as Doctor}
            setOpenModal={setOpenModal}
          />
        </ModalCustom>
      )}
      <div className={classes.wrapper}>
        <table className={classes.table}>
          <thead>
            <tr>
              <th className={classes.th}>Time</th>
              {days.map((day, index) => (
                <th key={index} className={classes.th}>
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, timeIndex) => (
              <tr key={timeIndex}>
                <td className={classes.td}>{time}</td>
                {days.map((day, dayIndex) => {
                  // Check if there's an availability for the current day and time
                  const availability = selectedDoctor?.availabilities.find(
                    (slot) => slot.day === day && slot.time === time
                  );

                  return (
                    <td
                      key={`${timeIndex}-${dayIndex}`}
                      className={`${availability ? classes.available : ''}`}
                      onClick={() => setOpenModal(true)}
                    >
                      {availability ? 'Available' : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AvailabilityTable;

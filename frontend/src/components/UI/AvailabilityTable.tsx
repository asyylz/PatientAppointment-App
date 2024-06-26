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

/* ------------------------ MAIN ------------------------ */
const AvailabilityTable: React.FC<AvailabilityProps> = ({ availability }) => {
  const { selectedDoctor } = useSelector((state: RootState) => state.doctors);
  const { userData } = useSelector((state: RootState) => state.currentUser);
  const slots = generateTimeSlots();
  const [openModal, setOpenModal] = useState<boolean>(false);


  if (!availability) {
    return <div>No availability data for this doctor</div>;
  }

  const mappedAvailability = mapAvailability(availability, slots);

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
                      onClick={() => setOpenModal(true)}
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
    </>
  );
};

export default AvailabilityTable;

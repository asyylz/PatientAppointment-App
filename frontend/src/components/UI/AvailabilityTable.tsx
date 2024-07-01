import React, { useState } from 'react';
import classes from './AvailabilityTable.module.css';
import { generateTimeSlots } from '../../utils/timeSlots';
//import { mapAvailability } from '../../utils/mapAvailability';
//import { generateDates } from '../../helper/GenerateWeekDays';
import { useSelector } from 'react-redux';
import ModalCustom from './ModalCustom';
import AppointmentForm from './AppointmentBookingForm';
import { getWeekDatesFromToday } from '../../helper/generateDates';

interface AvailabilityProps {
  availability: Availability;
}

const timeSlots = generateTimeSlots();

const daysMappedToDates = getWeekDatesFromToday();


/* ------------------------ MAIN ------------------------ */
const AvailabilityTable: React.FC<AvailabilityProps> = ({ availability }) => {
  const { selectedDoctor } = useSelector((state: RootState) => state.doctors);
  const { userData } = useSelector((state: RootState) => state.currentUser);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [slot, setSlot] = useState({ time: '', date: '' });

  // if (!availability) {
  //   return <div>No availability data for this doctor</div>;
  // }

  const handleSlotClick = (time: string, date: string) => {
    setOpenModal(true);
    setSlot({ time, date });
    console.log(`Selected time: ${time}, Selected day: ${date}`);
  };

  return (
    <>
      {openModal && (
        <ModalCustom>
          <AppointmentForm
            slot={slot}
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
              {daysMappedToDates.map((day, index) => (
                <th key={index} className={classes.th}>
                  <span>{day.date}</span>
                  <br />
                  <span>{day.day}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((time, timeIndex) => (
              <tr key={timeIndex}>
                <td className={classes.td}>{time}</td>
                {daysMappedToDates.map((day, dayIndex) => {
                  // Check if there's an availability for the current day and time
                  const availability = selectedDoctor?.availabilities.find(
                    (slot) => slot.day === day.day && slot.time === time
                  );

                  return (
                    <td
                      key={`${timeIndex}-${dayIndex}`}
                      className={`${availability ? classes.available : ''}`}
                      onClick={() => handleSlotClick(time, day.date)}
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

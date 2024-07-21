import React, { useEffect, useState } from 'react';
import classes from './AvailabilityTable.module.css';
import { generateTimeSlots } from '../../utils/timeSlots';
import { useSelector } from 'react-redux';
import ModalCustom from './ModalCustom';

import { getWeekDatesFromToday } from '../../helper/generateDates';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchAppointmentsForDoctor } from '../../store/appointmentsForDoctor-slice';
import AppointmentBookingForm from './AppointmentBookingForm';

const timeSlots = generateTimeSlots();

const daysMappedToDates = getWeekDatesFromToday();

/* ---------------------- COMPONENT --------------------- */
const AvailabilityTable: React.FC = () => {
  /* -------------------- Redux States -------------------- */
  const dispatch: AppDispatch = useDispatch();
  const { selectedDoctor } = useSelector((state: RootState) => state.doctors);
  const { userData, token } = useSelector(
    (state: RootState) => state.currentUser
  );

  // status and error should be reflected to dom
  const { entities } = useSelector(
    (state: RootState) => state.appointmentsForDoctor
  );
  const { appointmentsForDoctor } = entities;

  /* ---------------------- useSates ---------------------- */
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [slot, setSlot] = useState({ time: '', date: '' });

  useEffect(() => {
    if (selectedDoctor) {
      dispatch(
        fetchAppointmentsForDoctor({
          id: selectedDoctor?._id.toString(),
          token,
        })
      );
    }
  }, [openModal]);

  const handleSlotClick = (time: string, date: string) => {
    setOpenModal(true);
    setSlot({ time, date });
  };

  return (
    <>
      {openModal && (
        <ModalCustom height="900px" width="700px">
          <AppointmentBookingForm
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
                  // console.log(availability);

                  const slotStatus = availability
                    ? appointmentsForDoctor?.find(
                        (appointment:Appointment) =>
                          appointment.appointmentDateAndTime ===
                          // convertToDateandDateString(
                          //   availability.day,
                          //   availability.time
                          // ).availabilityDateTimeString
                          availability.currentWeekAvailabilityInDateFormat
                      )
                      ? 'Booked'
                      : 'Available'
                    : '-';

                  const conditionalClassName =
                    availability && slotStatus === 'Booked'
                      ? new Date(
                          availability.currentWeekAvailabilityInDateFormat
                        ) < new Date()
                        ? `${classes.booked} ${classes.past}`
                        : `${classes.booked}`
                      : availability && slotStatus === 'Available'
                      ? new Date(
                          availability.currentWeekAvailabilityInDateFormat
                        ) < new Date()
                        ? `${classes.available} ${classes.past}`
                        : `${classes.available}`
                      : '';

                  return (
                    <td
                      key={`${timeIndex}-${dayIndex}`}
                      className={conditionalClassName}
                      onClick={
                        slotStatus === 'Available' &&
                        !conditionalClassName.includes('past')
                          ? () => handleSlotClick(time, day.date)
                          : undefined
                      }
                    >
                      {slotStatus}
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

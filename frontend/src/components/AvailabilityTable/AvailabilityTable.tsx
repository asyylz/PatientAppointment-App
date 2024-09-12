import React, { useEffect, useState } from 'react';
import classes from './AvailabilityTable.module.css';
import { generateTimeSlots } from '../../utils/timeSlots';
import { useSelector } from 'react-redux';
import ModalCustom from '../ModalCustom/ModalCustom';
import {
  getWeekDatesFromToday,
  getFormattedAvailabilityDate,
} from '../../helper/generateDates/generateDates';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/index';
import { fetchAppointmentsForDoctor } from '../../store/appointmentsForDoctor-slice/appointmentsForDoctor-slice';
import AppointmentBookingForm from './../AppointmentBookingForm/AppointmentBookingForm';
import { GrNext, GrPrevious } from 'react-icons/gr';

const timeSlots = generateTimeSlots();

/* ---------------------- COMPONENT --------------------- */
const AvailabilityTable: React.FC = () => {
  /* -------------------- Redux States -------------------- */
  const dispatch: AppDispatch = useDispatch();
  const { selectedDoctor } = useSelector((state: RootState) => state.doctors);
  const { userData } = useSelector((state: RootState) => state.currentUser);

  // status and error should be reflected to dom
  const { entities } = useSelector(
    (state: RootState) => state.appointmentsForDoctor
  );
  const { appointmentsForDoctor } = entities;
  //console.log(appointmentsForDoctor)
  //console.log(appointmentsForDoctor?.length)

  /* ---------------------- useSates ---------------------- */
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [slot, setSlot] = useState({ time: '', date: '' });
  const [week, setWeek] = useState<'current' | 'next'>('current');

  const daysMappedToDates = getWeekDatesFromToday(week);

  useEffect(() => {
    if (selectedDoctor) {
      dispatch(
        fetchAppointmentsForDoctor({
          id: selectedDoctor?._id.toString(),
        })
      );
    }
  }, [openModal, selectedDoctor]);

  const handleSlotClick = (time: string, date: string) => {
    setOpenModal(true);
    setSlot({ time, date });
  };

  return (
    <>
      {openModal && (
        <ModalCustom>
          <AppointmentBookingForm
            slot={slot}
            user={userData as userData}
            doctor={selectedDoctor as Doctor}
            setOpenModal={setOpenModal}
          />
        </ModalCustom>
      )}
      <div>
        <div className={classes['week__buttons-wrapper']}>
          <div
            className={classes['pagination__icon--wrapper']}
            onClick={() => setWeek('current')}
          >
            <GrPrevious />
          </div>
          <p>{`${week.toUpperCase()} WEEK`} </p>
          <div
            onClick={() => setWeek('next')}
            className={classes['pagination__icon--wrapper']}
          >
            <GrNext />
          </div>
        </div>
        <div
          //style={{ border: '1px solid red' }}
          className={classes['availability__container']}
        >
          <table>
            <thead>
              <tr>
                <th>Time</th>
                {daysMappedToDates.map((day, index) => (
                  <th key={index}>
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
                  <td>{time}</td>
                  {daysMappedToDates.map((day, dayIndex) => {
                    // Check if there's an availability for the current day and time
                    const availability = selectedDoctor?.availabilities.find(
                      (slot) => slot.day === day.day && slot.time === time
                    );
                    //console.log(availability);

                    const slotStatus = availability
                      ? appointmentsForDoctor?.find(
                          (appointment: Appointment) =>
                            appointment.appointmentDateAndTime ===
                            //availability.currentWeekAvailabilityInDateFormat
                            getFormattedAvailabilityDate(day.day, time, week)
                        )
                        ? 'Booked'
                        : 'Available'
                      : '-';

                    const conditionalClassName =
                      availability && slotStatus === 'Booked'
                        ? new Date(
                            getFormattedAvailabilityDate(day.day, time, week)
                          ) < new Date()
                          ? `${classes.booked} ${classes.past}`
                          : `${classes.booked}`
                        : availability && slotStatus === 'Available'
                        ? new Date(
                            getFormattedAvailabilityDate(day.day, time, week)
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
      </div>
    </>
  );
};

export default AvailabilityTable;

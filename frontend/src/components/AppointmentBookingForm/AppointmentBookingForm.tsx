import React, { useState, useCallback } from 'react';
import classes from './AppointmentBookingForm.module.css';
import useHttp from '../../hooks/useHttp/useHttp';
import {
  convertDateAndTimeStringToDate,
} from '../../helper/generateDates/generateDates';
import CustomInput from '../CustomInput/CustomInput';

interface AppointmentBookingFormProps {
  user: userData;
  doctor: Doctor | null;
  slot: { time: string; date: string };
  setOpenModal: (openModal: boolean) => void;
}

const AppointmentBookingForm: React.FC<AppointmentBookingFormProps> = ({
  user,
  doctor,
  setOpenModal,
  slot,
}) => {
  const { createAppointment } = useHttp();

  const [appointment, setAppointment] = useState<AppointmentForBooking>({
    doctorId: doctor?._id,
    patientId: user._id,
    appointmentDateAndTime: convertDateAndTimeStringToDate(
      slot.date,
      slot.time
    ),
    reason: '',
  });

  const handleChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const { name, value } = e.target;

      setAppointment((prev) => {
        if (name === 'appointmentDate' || name === 'appointmentTime') {
          const newDate =
            name === 'appointmentDate'
              ? value
              : prev.appointmentDateAndTime.toISOString().split('T')[0];
          const newTime =
            name === 'appointmentTime'
              ? value
              : prev.appointmentDateAndTime
                  .toISOString()
                  .split('T')[1]
                  .substring(0, 5);
          return {
            ...prev,
            appointmentDateAndTime: convertDateAndTimeStringToDate(
              newDate,
              newTime
            ),
          };
        }
        return { ...prev, [name]: value };
      });
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await createAppointment(appointment);
    if (response.status === 'success') {
      setOpenModal(false);
    }
  };

  return (
    <div className={classes['booking__container']}>
      <h1 className={classes['booking__container-title']}>Booking Form</h1>
      <form
        className={classes['booking__container-form']}
        onSubmit={handleSubmit}
      >
        <CustomInput
          name="doctor"
          value={`Dr.${doctor?.firstName} ${doctor?.lastName}`}
          type="text"
          readOnly
        />
        <CustomInput value={doctor?.departmentId.departmentMain} readOnly />
        <select
          className={classes['booking__container-select']}
          name="subDepartmentName"
          onChange={handleChange}
          //value={appointment.subDepartmentName}
          required
        >
          <option value="">Choose Sub Department</option>
          {doctor?.departmentId.departmentSub.map((el, index) => (
            <option key={index} value={el}>
              {el}
            </option>
          ))}
        </select>
        <CustomInput type="text" value={user.name} readOnly />
        <CustomInput
          type="date"
          value={appointment.appointmentDateAndTime.toISOString().split('T')[0]}
          name="appointmentDate"
          onChange={handleChange}
        />
        <CustomInput
          placeHolder="Appointment Time"
          value={appointment.appointmentDateAndTime
            .toISOString()
            .split('T')[1]
            .substring(0, 5)}
          name="appointmentTime"
          type="time"
          onChange={handleChange}
          required
        />
        <textarea
          className={classes['booking__container-reason']}
          placeholder="Please write your concerns..."
          name="reason"
          onChange={handleChange}
          value={appointment.reason}
          rows={8}
          cols={45}
        />
        <button type="submit">Book</button>
        <button type="button" onClick={() => setOpenModal(false)}>
          Close
        </button>
      </form>
    </div>
  );
};

export default AppointmentBookingForm;

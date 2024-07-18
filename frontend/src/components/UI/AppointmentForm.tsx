import React, { useState } from 'react';
import classes from './AppointmentForm.module.css';
import useHttp from '../../hooks/useHttp';
import CustomInput from './CustomInput';
import { toastErrorNotify } from '../../helper/ToastNotify';

interface AppointmentFormProps {
  setOpenModal: (openModal: string) => void;
  appointment: SingleAppointmentForDoctor | Appointment | undefined;
  isPatient: boolean;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  setOpenModal,
  appointment,
  isPatient,
}) => {
  const { updateAppointment, deleteAppointment } = useHttp();

  const [updatedAppointmentData, setUpdatedAppointmentData] = useState<
    object | undefined
  >();

  const [appointmentDate, setAppointmentDate] = useState(
    appointment?.appointmentDateAndTime.split('T')[0]
  );
  const [appointmentTime, setAppointmentTime] = useState(
    appointment?.appointmentDateAndTime.split('T')[1]
  );

  console.log('Doctorid', appointment?.doctorId);
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === 'appointmentDate') {
      setAppointmentDate(value);
      const formatted = new Date(`${value}T${appointmentTime}`);
      //console.log(formatted);
      setUpdatedAppointmentData((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        appointmentDateAndTime: formatted,
      }));
    } else if (name === 'appointmentTime') {
      setAppointmentTime(value);
      const formatted = new Date(`${appointmentDate}T${value}:00.000Z`);
      setUpdatedAppointmentData((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        appointmentDateAndTime: formatted,
      }));
    } else {
      setUpdatedAppointmentData((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await updateAppointment(
      updatedAppointmentData,
      appointment?._id
    );
    if (response.status === 'success') {
      setOpenModal('');
    }
  };
  const handleDeleteAppointment = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const response = await deleteAppointment(appointment?._id);
    if (response?.status === 204) setOpenModal('');
    else toastErrorNotify('Appointment could not deleted');
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Appointment Details</h1>
      <form onSubmit={handleSubmit}>
        <div className={classes.leftSection}>
          <CustomInput
            value={
              isPatient
                ? `Dr. ${appointment?.doctorId?.firstName} ${appointment?.doctorId.lastName}`
                : appointment?.patientId?.name
            }
            readOnly
          />
          <input
            placeholder="Appointment Date"
            // value={formatDateForUI(appointment?.appointmentDateAndTime)}
            defaultValue={appointment?.appointmentDateAndTime.split('T')[0]}
            type="date"
            name="appointmentDate"
            onChange={handleChange}
          />
          <input
            placeholder="Appointment Time"
            //value={appointment?.appointmentDateAndTime}
            defaultValue={appointment?.appointmentDateAndTime
              .split('T')[1]
              .slice(0, 5)}
            name="appointmentTime"
            type="time"
            step="1800"
            onChange={handleChange}
          />
          <textarea
            className={classes.reason}
            placeholder="Please write your concerns..."
            name="reason"
            defaultValue={appointment?.reason}
            onChange={handleChange}
            rows={8}
            cols={36}
          ></textarea>
        </div>

        <div className={classes.leftSection}>
          {!isPatient ? (
            <select
              name="status"
              id="status"
              onChange={handleChange}
              defaultValue={appointment?.status}
            >
              <option>Pelease choose a status</option>
              <option value="completed">Completed</option>
            </select>
          ) : (
            <CustomInput value={appointment?.status} readOnly />
          )}
          {!isPatient ? (
            <select
              name="referral"
              id="referral"
              onChange={handleChange}
              defaultValue={appointment?.referral.toString()}
            >
              <option>Pelease choose a referral status</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          ) : (
            <CustomInput
              value={appointment?.referral ? 'Referral' : 'Not referral'}
              readOnly
            />
          )}

          <textarea
            className={classes.result}
            defaultValue={appointment?.diagnose}
            placeholder="Please write diagnoses..."
            name="diagnose"
            onChange={handleChange}
            rows={8}
            cols={36}
            readOnly={isPatient}
            style={
              isPatient ? { opacity: 0.7, backgroundColor: 'lightgray' } : {}
            }
          ></textarea>
        </div>
        <div className={classes.buttonContainer}>
          {' '}
          <button type="submit">Update</button>
          <button onClick={handleDeleteAppointment}>Cancel</button>
          <button onClick={() => setOpenModal('')}>Close</button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;

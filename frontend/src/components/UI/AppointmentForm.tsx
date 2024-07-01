import React, { useState } from 'react';
import classes from './AppointmentForm.module.css';
import useHttp from '../../hooks/useHttp';
import {
  formatDateForInput,
  convertDateStringToDate,
  formatDateForInput2,
} from '../../helper/generateDates';

interface AppointmentFormProps {
  setOpenModal: (openModal: boolean) => void;
  appointment: AppointmentForDoctors | undefined;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  setOpenModal,
  appointment,
}) => {
  const { updateAppointment } = useHttp();
  console.log(appointment);

  const [updatedAppointmentData, setUpdatedAppointmentData] = useState<
    object | undefined
  >();
  console.log(updatedAppointmentData);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === 'appointmentDate') {
      const formattedDate = convertDateStringToDate(value);
      console.log(formattedDate);
      setUpdatedAppointmentData((prevValuesAppointment) => ({
        ...prevValuesAppointment,
        appointmentDate: formattedDate,
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

    const response = await updateAppointment(updatedAppointmentData);
    console.log(response);
    if (response.status === 'success') {
      setOpenModal(false);
    }
  };

  return (
    <div className={classes.container}>
      <h1 className={classes.title}>Booking Form</h1>
      <form onSubmit={handleSubmit}>
        {/* <div className={classes.leftSection}>
          {' '}
          <input
            type="text"
            name="doctor"
            placeholder="Choose Doctor"
            value={`Dr.${doctor?.firstName} ${doctor?.lastName}`}
            required
          />
          <select name="mainDepartment">
            <option value={0}>{doctor?.departmentId.departmentMain}</option>
          </select>
          <select name="subDepartmentName" onChange={handleChange} required>
            <option>Choose Sub Department</option>
            {doctor?.departmentId.departmentSub.map((el, index) => (
              <option key={index} value={el}>
                {el}
              </option>
            ))}
          </select>
        </div> */}
        <div className={classes.rightSection}>
          <input
            type="text"
            value={appointment?.patientId.name}
            placeholder="Patient Name"
            required
          />
          <input
            placeholder="Appointment Date"
            defaultValue={formatDateForInput2(appointment?.appointmentDate)}
            type="date"
            name="appointmentDate"
            onChange={handleChange}
            required
          />
          <input
            placeholder="Appointment Time"
            defaultValue={appointment?.time}
            name="time"
            type="time"
            onChange={handleChange}
            required
          />
        </div>
        <textarea
          className={classes.reason}
          placeholder="Please write your concerns..."
          name="reason"
          defaultValue={appointment?.reason}
          onChange={handleChange}
          rows={8}
          cols={45}
        ></textarea>
        <button type="submit">Book</button>
        <button onClick={() => setOpenModal(false)}>Close</button>
      </form>
    </div>
  );
};

export default AppointmentForm;

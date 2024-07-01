import React, { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { useSelector } from 'react-redux';
import { formatDateForUI } from '../../helper/generateDates';
import classes from './Appointments.module.css';
import { MdDoneOutline } from 'react-icons/md';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import ModalCustom from '../../components/UI/ModalCustom';
import AppointmentForm from '../../components/UI/AppointmentForm';

const Appointments: React.FC = () => {
  const axiosWithToken = useAxios();
  const [appointments, setAppointments] = useState<AppointmentForDoctors[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState<boolean>(false);

  const { userData } = useSelector((state: RootState) => state.currentUser);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosWithToken(
          `http://localhost:3000/api/v1/appointments/doctors/${userData?._id}`
        );
        console.log(response.data.data);
        setAppointments(response.data.data.appointments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleClick = () => {
    setOpenModal(true);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      {openModal && (
        <ModalCustom>
          <AppointmentForm setOpenModal={setOpenModal} />
        </ModalCustom>
      )}

      <table className="appointments">
        <thead>
          <tr>
            <th>Patient Name</th>
            {/* <th>DOB</th> */}
            <th>Concerns</th>
            <th>Date</th>
            <th>Time</th>
            {/* <th>Status</th>
          <th>Referrals</th> */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr className={classes.gapLine}></tr>
          {appointments?.map((appointment: AppointmentForDoctors) => (
            <>
              <tr
                key={appointment._id}
                className={classes.row}
                onClick={handleClick}
              >
                <td>{appointment.patientId?.name}</td>
                <td>{appointment.reason}</td>
                <td>{formatDateForUI(appointment.appointmentDate)}</td>
                <td>{appointment.time}</td>
                <td>
                  <FaRegEdit className={`${classes.icons} ${classes.edit}`} />
                  <MdDoneOutline
                    className={`${classes.icons} ${classes.tick}`}
                  />
                  <FaRegTrashAlt
                    className={`${classes.icons} ${classes.trash}`}
                  />
                </td>
              </tr>
              <tr className={classes.gapLine}></tr>
            </>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Appointments;

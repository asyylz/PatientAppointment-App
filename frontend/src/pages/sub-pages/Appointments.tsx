import React, { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import { useSelector } from 'react-redux';

const Appointments: React.FC = () => {
  const axiosWithToken = useAxios();
  const [appointments, setAppointments] = useState<Appointment[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { userData } = useSelector((state: RootState) => state.currentUser);
console.log(userData)
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosWithToken(
          `http://localhost:3000/api/v1/appointments/doctors/${userData?._id}`
        );
        console.log(response.data.data);
        setAppointments(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <table className="appointments">
      <thead>
        <tr>
          <th>Patient Name</th>
          <th>DOB</th>
          <th>Concerns</th>
          <th>Appointment Date</th>
          <th>Status</th>
          <th>Referrals</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr
        //key={patient.id}
        //className={patient.isSeen ? 'completed' : 'active'}
        >
          <td>Patient Name</td>
          <td>Patient DOB</td>
          <td>Concerns</td>
          <td>Appointment Date</td>
          {/* <td>{patient.isSeen ? 'Completed' : 'Active'}</td>
                <td>{patient.referral ? 'Referred' : 'Not Applied'}</td> */}
          <td>
            {/* <FaRegEdit className="icons edit" />
                  <MdDoneOutline className="icons tick" />
                  <FaRegTrashAlt className="icons trash" /> */}
          </td>
        </tr>
        <tr className="gap-line"></tr>
      </tbody>
    </table>
  );
};

export default Appointments;

import React from 'react';
import DoctorDetails from '../../components/UI/DoctorDetails';
import { RootState } from './../../store/index';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DoctorDetailsPage: React.FC = () => {
  const { doctorId } = useParams<{ doctorId: string }>();
  // const params = useParams<{ doctorId: string }>(); // Get the parameters from the URL
  // const doctorId = params.doctorId; // Access the doctorId parameter

  const {
    entities: doctors,
    status,
    error,
  } = useSelector((state: RootState) => state.doctors);

  const doctor = doctors.find((doctor) => doctor._id.toString() === doctorId);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!doctor) {
    return <div>Doctor not found</div>;
  }
  return (
    <div style={{ border: '4px solid green' }}>
      <h1>Doctor</h1>
      <DoctorDetails doctor={doctor as Doctor} />
    </div>
  );
};

export default DoctorDetailsPage;

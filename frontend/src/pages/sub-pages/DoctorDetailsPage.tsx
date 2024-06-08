import React from 'react';
import DoctorDetails from '../../components/UI/DoctorDetails';
//import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DoctorDetailsPage: React.FC = () => {
  //const { doctorId } = useParams<{ doctorId: string }>();

  const {
    entities: doctors,
    status,
    error,
    selectedDoctor,
  } = useSelector((state: RootState) => state.doctors);

  console.log(status);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!selectedDoctor) {
    return <div>Doctor not found</div>;
  }
  return (
    <div style={{ border: '4px solid green' }}>
      <h1>{`Dr ${selectedDoctor.firstName} ${selectedDoctor.lastName}`}</h1>
      {/* {status === 'loading' && <div>Loading...</div>} */}
      <DoctorDetails />
    </div>
  );
};

export default DoctorDetailsPage;

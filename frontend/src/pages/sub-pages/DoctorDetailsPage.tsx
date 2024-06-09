import React from 'react';
import DoctorDetails from '../../components/UI/DoctorDetails';
import { useSelector } from 'react-redux';

const DoctorDetailsPage: React.FC = () => {
  const {
    entities: doctors,
    status,
    error,
    selectedDoctor,
  } = useSelector((state: RootState) => state.doctors);
  
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
      <h1>{selectedDoctor.departmentName}</h1>
      {/* {status === 'loading' && <div>Loading...</div>} */}
      <DoctorDetails />
    </div>
  );
};

export default DoctorDetailsPage;

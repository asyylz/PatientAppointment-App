import React from 'react';
import DoctorDetails from '../../components/UI/DoctorDetails';
import { useSelector } from 'react-redux';
import classes from './DoctorDetailsPage.module.css';
import GlobalLink from '../../components/UI/GlobalLink';
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
    <div
      className={classes.container} // not yet given styles
      //style={{ border: '4px solid purple' }}
    >
      {' '}
      <GlobalLink text="Back" to={-1} />{' '}
      <h1>{`Dr ${selectedDoctor.firstName} ${selectedDoctor.lastName}`}</h1>
      <h1>{selectedDoctor.departmentName}</h1>
      <DoctorDetails />
    </div>
  );
};

export default DoctorDetailsPage;

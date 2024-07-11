import React from 'react';
import classes from './ProfileForm.module.css';
import CustomInput from './CustomInput';
import { useSelector } from 'react-redux';
import { formatDateForInput } from '../../helper/generateDates';

const ProfileForm: React.FC = () => {
  const { userData, status } = useSelector(
    (state: RootState) => state.currentUser
  );
  console.log(userData?.DOB);
  
  if (status === 'loading') <p>Loading...</p>;

  return (
    userData && (
      <div className={classes.container}>
        <CustomInput
          defaultValue={userData?.name}
          type="text"
          title="name"
          placeHolder="Enter your name"
        />
        <CustomInput
          defaultValue={userData.email}
          type="text"
          title="email"
          placeHolder="Enter your email"
        />
        <CustomInput
          defaultValue={formatDateForInput(userData.DOB)}
          type="date"
          title="DOB"
          placeHolder="Enter your DOB"
        />
      </div>
    )
  );
};

export default ProfileForm;

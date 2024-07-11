import React from 'react';
import classes from './ProfileForm.module.css';
import CustomInput from './CustomInput';
import { useSelector } from 'react-redux';
import { formatDateForInput } from '../../helper/generateDates';

const ProfileForm: React.FC = () => {
  const { userData, status, image } = useSelector(
    (state: RootState) => state.currentUser
  );

  if (status === 'loading') <p>Loading...</p>;

  return (
    userData && (
      <div className={classes.container}>
        <div className={classes.imageWrapper}>
          <img src={image} alt="" />
        </div>
        <div className={classes.infoWrapper}>
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
          <CustomInput
            defaultValue="password"
            type="password"
            title="Password"
            placeHolder="Enter your password"
          />
          <CustomInput
            defaultValue={null}
            type="password"
            title="Password"
            placeHolder="Confirm your new password"
          />
          <CustomInput
            defaultValue={null}
            type="password"
            title="Password"
            placeHolder="Confirm your new password"
          />
        </div>

        <div className={classes.buttonWrapper}>
          <button>Update</button>
          <button>Cancel</button>
        </div>
      </div>
    )
  );
};

export default ProfileForm;

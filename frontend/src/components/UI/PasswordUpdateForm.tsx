import React, { useState } from 'react';
import CustomInput from './CustomInput';
import classes from'./PasswordUpdateForm.module.css'

const PasswordResetForm: React.FC = () => {
  const [updatedUserData, setUpdatedUserData] = useState<object>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <CustomInput
          type="password"
          name="oldPassword"
          placeHolder="Enter your old password"
          onChange={handleInputChange}
        />
        <CustomInput
          type="password"
          name="newPassword"
          placeHolder="Your new password"
          onChange={handleInputChange}
        />
        <CustomInput
          type="password"
          name="confirmNewPassword"
          placeHolder="Confirm your new password"
          onChange={handleInputChange}
        />
      </div>
      <div className={classes.buttonWrapper}>
        {' '}
        <button>Update</button>
        <button>Cancel</button>
      </div>
    </div>
  );
};

export default PasswordResetForm;

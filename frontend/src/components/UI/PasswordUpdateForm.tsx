import React, { useState } from 'react';
import CustomInput from './CustomInput';
import classes from './PasswordUpdateForm.module.css';

const PasswordResetForm: React.FC = () => {
  const [updatedUserPassword, setupdatedUserPassword] =
    useState<UpdatedUserPassword | null>({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setupdatedUserPassword((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Updated Password Data:', updatedUserPassword);
    // Add logic to handle password update
  };

  const handleClearInputs = () => {
    setupdatedUserPassword({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  console.log(updatedUserPassword);

  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <CustomInput
          type="password"
          name="oldPassword"
          placeHolder="Enter your old password"
          onChange={handleInputChange}
          value={updatedUserPassword?.oldPassword}
        />
        <CustomInput
          type="password"
          name="newPassword"
          placeHolder="Your new password"
          onChange={handleInputChange}
          value={updatedUserPassword?.newPassword}
        />
        <CustomInput
          type="password"
          name="confirmNewPassword"
          placeHolder="Confirm your new password"
          onChange={handleInputChange}
          value={updatedUserPassword?.confirmNewPassword}
        />
      </div>
      <div className={classes.buttonWrapper}>
        {' '}
        <button type="submit" onClick={handleSubmit}>
          Update
        </button>
        <button onClick={handleClearInputs}>Cancel</button>
      </div>
    </div>
  );
};

export default PasswordResetForm;

import React, { useState } from 'react';
import CustomInput from '../CustomInput/CustomInput';
import classes from './PasswordUpdateForm.module.css';
import useHttp from '../../hooks/useHttp/useHttp';

const PasswordResetForm: React.FC = () => {
  const [updatedUserPasswordData, setUpdatedUserPasswordData] =
    useState<UpdatedUserPasswordData>({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });

  const { updateUserPassword } = useHttp();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdatedUserPasswordData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updatedUserPasswordData) {
      updateUserPassword({
        oldPassword: updatedUserPasswordData.oldPassword,
        newPassword: updatedUserPasswordData.newPassword,
        confirmNewPassword: updatedUserPasswordData.confirmNewPassword,
      });
    }
    handleClearInputs();
  };

  const handleClearInputs = () => {
    setUpdatedUserPasswordData({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  return (
    <div className={classes['password__container']}>
      <div className={classes.wrapper}>
        <CustomInput
          type="password"
          name="oldPassword"
          placeHolder="Enter your old password"
          onChange={handleInputChange}
          value={updatedUserPasswordData?.oldPassword}
        />
        <CustomInput
          type="password"
          name="newPassword"
          placeHolder="Your new password"
          onChange={handleInputChange}
          value={updatedUserPasswordData?.newPassword}
        />
        <CustomInput
          type="password"
          name="confirmNewPassword"
          placeHolder="Confirm your new password"
          onChange={handleInputChange}
          value={updatedUserPasswordData?.confirmNewPassword}
        />
      </div>
      {/* buttonContainer takes styles from global */}
      <div className="buttonContainer">
        <button type="submit" onClick={handleSubmit}>
          Update
        </button>
        <button onClick={handleClearInputs}>Cancel</button>
      </div>
    </div>
  );
};

export default PasswordResetForm;

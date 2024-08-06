import React, { useState } from 'react';
import CustomInput from './CustomInput';
import classes from './PasswordUpdateForm.module.css';
import { useDispatch } from 'react-redux';
import { updatePassword } from '../../store/currentUser-slice';
import { AppDispatch } from '../../store';

const PasswordResetForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  
  const [updatedUserPasswordAndToken, setUpdatedUserPasswordAndToken] =
    useState({
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
    setUpdatedUserPasswordAndToken((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updatedUserPasswordAndToken) {
      dispatch(
        updatePassword({
          oldPassword: updatedUserPasswordAndToken.oldPassword,
          newPassword: updatedUserPasswordAndToken.newPassword,
          confirmNewPassword: updatedUserPasswordAndToken.confirmNewPassword,
        })
      );
    }
    handleClearInputs();
  };

  const handleClearInputs = () => {
    setUpdatedUserPasswordAndToken({
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
          value={updatedUserPasswordAndToken?.oldPassword}
        />
        <CustomInput
          type="password"
          name="newPassword"
          placeHolder="Your new password"
          onChange={handleInputChange}
          value={updatedUserPasswordAndToken?.newPassword}
        />
        <CustomInput
          type="password"
          name="confirmNewPassword"
          placeHolder="Confirm your new password"
          onChange={handleInputChange}
          value={updatedUserPasswordAndToken?.confirmNewPassword}
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

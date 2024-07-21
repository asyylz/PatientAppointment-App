import React, { useState } from 'react';
import CustomInput from './CustomInput';
import classes from './PasswordUpdateForm.module.css';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { updatePassword } from '../../store/currentUser-slice';

const PasswordResetForm: React.FC = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.currentUser);

  const [updatedUserPasswordAndToken, setUpdatedUserPasswordAndToken] =
    useState({
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  console.log(updatedUserPasswordAndToken);

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
    console.log('Updated Password Data:', updatedUserPasswordAndToken);
    if (updatedUserPasswordAndToken) {
      dispatch(updatePassword({ updatedUserPasswordAndToken, token }));
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
    <div className={classes.container}>
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

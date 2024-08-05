import React, { useEffect, useState } from 'react';
import CustomInput from '../../components/UI/CustomInput';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../store/currentUser-slice';
import { useSelector } from 'react-redux';
import { AppDispatch } from '../../store';
import classes from './ResetPassword.module.css';

interface data {
  password: string;
  passwordConfirm: string;
  resetToken: string;
}

const ResetPassword: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state: RootState) => state.currentUser);

  const [passwordAndResetTokenData, setPasswordAndResetTokenData] =
    useState<data>({
      password: '',
      passwordConfirm: '',
      resetToken: '',
    });

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (passwordAndResetTokenData) {
      dispatch(resetPassword({ ...passwordAndResetTokenData }));
    }
  };

  useEffect(() => {
    if (status === 'success') {
      navigate('/user/dashboard');
    }
  }, [status, navigate]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPasswordAndResetTokenData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  return (
    <div className={classes.container}>
      <CustomInput
        name="password"
        type="password"
        placeHolder="Please enter your new password"
        onChange={handleInputChange}
      />
      <CustomInput
        name="passwordConfirm"
        type="password"
        placeHolder="Confirm your password"
        onChange={handleInputChange}
      />
      <button onClick={handleClick}>Update</button>
    </div>
  );
};

export default ResetPassword;

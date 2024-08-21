import React, { useEffect, useState } from 'react';
import CustomInput from '../../components/UI/CustomInput';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classes from './ResetPassword.module.css';
import useHttp from '../../hooks/useHttp';


const ResetPassword: React.FC = () => {
  //const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { status } = useSelector((state: RootState) => state.currentUser);
  const { resetPassword } = useHttp();
  const [passwordAndResetTokenData, setPasswordAndResetTokenData] =
    useState<PasswordResetData>({
      password: '',
      passwordConfirm: '',
      resetToken: '',
    });

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (passwordAndResetTokenData) {
      await resetPassword({ ...passwordAndResetTokenData });
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

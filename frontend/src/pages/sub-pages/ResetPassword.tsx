import React, { useState } from 'react';
import CustomInput from '../../components/UI/CustomInput';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../store/currentUser-slice';

interface data {
  password: string;
  passwordConfirm: string;
  resetToken?: string;
}

const ResetPassword: React.FC = () => {
  const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  };
  const dispatch = useDispatch();
  const { resetToken } = useParams();
  const [passwordData, setPasswordData] = useState<data>({
    password: '',
    passwordConfirm: '',
    resetToken,
  });
  //const resetToken = params.get('accessToken');
  console.log(resetToken);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (passwordData) {
      dispatch(resetPassword({ ...passwordData }));
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setPasswordData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  return (
    <>
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
    </>
  );
};

export default ResetPassword;

import React, { useEffect, useState } from 'react';
import CustomInput from '../../components/UI/CustomInput';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../store/currentUser-slice';
import { useSelector } from 'react-redux';

interface data {
  password: string;
  passwordConfirm: string;
  resetToken?: string;
}

const ResetPassword: React.FC = () => {
  // const useQuery = () => {
  //   return new URLSearchParams(useLocation().search);
  // };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { resetToken } = useParams();
  const { status, token } = useSelector(
    (state: RootState) => state.currentUser
  );

  const [passwordAndResetTokenData, setPasswordAndResetTokenData] =
    useState<data>({
      password: '',
      passwordConfirm: '',
      resetToken,
    });
  //const resetToken = params.get('accessToken');
  console.log(resetToken);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (passwordAndResetTokenData) {
      await dispatch(resetPassword({ ...passwordAndResetTokenData }));
    }
    console.log(status);

    // if (status === 'reset success' && token) {
    //   navigate('/user/dashboard');
    // }
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

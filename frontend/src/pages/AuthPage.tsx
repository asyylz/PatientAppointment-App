import { useSelector } from 'react-redux';
import classes from './AuthPage.module.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './../store/index';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, login, register } from '../store/currentUser-slice';
import CustomInput from '../components/UI/CustomInput';
import Navbar from '../components/UI/Navbar';

const AuthPage = () => {
  const [registerData, setRegisterData] = useState<Credentials>({
    name: '',
    email: '',
    password: '',
    DOB: '',
    passwordConfirm: '',
    policy: false,
  });
  const [loginData, setLoginData] = useState<Credentials>({
    // email: '',
    // password: '',
    email: 'alice@test.com',
    password: '6946224Asy!',
  });

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const { status } = useSelector((state: RootState) => state.currentUser);

  const { selectedDoctor } = useSelector((state: RootState) => state.doctors);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loginData && loginData.email && loginData.password) {
      const response = await dispatch(
        login({ email: loginData.email, password: loginData.password })
      );
      console.log(response);
      console.log(login.fulfilled.match(response));
      if (login.fulfilled.match(response))
        setLoginData({
          email: '',
          password: '',
        });
    }
  };

  useEffect(() => {
    if (status === 'success') {
      navigate('/user/dashboard');
    }
  }, [status, navigate, selectedDoctor]);

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userFormData = new FormData();
    if (registerData) {
      Object.entries(registerData).forEach(([key, value]) => {
        if (value !== undefined) {
          userFormData.append(key, value.toString()); // Ensure value is a string
        }
      });
    }
    const response = await dispatch(register(userFormData)); // Handle async action
    if (register.fulfilled.match(response))
      setRegisterData({
        name: '',
        email: '',
        password: '',
        DOB: null,
        passwordConfirm: '',
        policy: false,
      });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (name === 'DOB' && type === 'date') {
      const formattedDate = new Date(`${value}T00:00:00.000Z`);
      setRegisterData((prevValues) => ({
        ...prevValues,
        DOB: formattedDate,
      }));
    } else if (name === 'policy' && type === 'checkbox') {
      const checkboxValue = (e.target as HTMLInputElement).checked;
      setRegisterData((prevValues) => ({
        ...prevValues,
        policy: checkboxValue,
      }));
    } else {
      setRegisterData((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleClick = () => {
    //e: React.MouseEvent
    //e.preventDefault();
    if (loginData && loginData.email) {
      dispatch(forgotPassword({ email: loginData.email }));
    }
  };

  return (
    //container takes styles local
    <div className={classes.container}>
      {/*------------------------ Login ----------------------- */}
      <div className={classes.wrapper}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <CustomInput
            type="email"
            name="email"
            value={loginData?.email}
            placeHolder="Enter your email"
            onChange={(e) =>
              setLoginData((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />

          <CustomInput
            type="password"
            name="password"
            value={loginData?.password}
            placeHolder="Enter your password"
            onChange={(e) =>
              setLoginData((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
          <div className={classes['forgot-password__wrapper']}>
            <p>Forgot your password?</p>

            <a onClick={handleClick}>Click here</a>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>

      {/*------------------------ Register ----------------------- */}
      <div className={classes.wrapper}>
        <h2>Registration</h2>
        <form onSubmit={handleRegisterSubmit}>
          <CustomInput
            type="text"
            name="name"
            value={registerData?.name}
            placeHolder="Enter your name"
            onChange={handleInputChange}
            required
          />

          <CustomInput
            type="email"
            name="email"
            value={registerData?.email}
            placeHolder="Enter your email"
            onChange={handleInputChange}
            required
          />
          <CustomInput
            type="date"
            name="DOB"
            //value={registerData.DOB}
            placeHolder="Enter your DOB"
            onChange={handleInputChange}
            required
          />

          <CustomInput
            type="password"
            name="password"
            value={registerData.password}
            placeHolder="Enter your password"
            onChange={handleInputChange}
          />
          <CustomInput
            type="password"
            name="passwordConfirm"
            value={registerData.passwordConfirm}
            placeHolder="Confirm your password"
            onChange={handleInputChange}
            required
          />
          <div className={classes['policy__wrapper']}>
            <input
         
              name="policy"
              type="checkbox"
              onChange={handleInputChange}
              value={registerData.policy?.toString()}
              required
            />
            <h3>I accept all terms & condition</h3>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};
export default AuthPage;

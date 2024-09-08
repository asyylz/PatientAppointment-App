import { useSelector } from 'react-redux';
import classes from './AuthPage.module.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './../store/index';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../store/currentUser-slice';
import CustomInput from '../components/UI/CustomInput';
import useHttp from '../hooks/useHttp';

const AuthPage = () => {
  const [registerData, setRegisterData] = useState<Credentials>({
    name: '',
    email: '',
    password: '',
    DOB: '1990-01-01',
    passwordConfirm: '',
    policy: false,
  });
  const [loginData, setLoginData] = useState<Credentials>({
    email: '',
    password: '',
  });

  const { forgotPassword } = useHttp();
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const { status } = useSelector((state: RootState) => state.currentUser);

  console.log(status);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loginData && loginData.email && loginData.password) {
      await dispatch(
        login({ email: loginData.email, password: loginData.password })
      );
      if (login.fulfilled?.type === 'currentUser/login/fulfilled') {
        setLoginData({
          email: '',
          password: '',
        });
      }
    }
  };

  // email: 'alice@test.com',
  // password: '6946224Asy!',
  useEffect(() => {
    if (status === 'login success' || status === 'register success') {
      navigate('/user/dashboard');
    }
  }, [status, navigate]);

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(register(registerData)); // Handle async action
    if (register.fulfilled?.type === 'currentUser/register/fulfilled') {
      setRegisterData({
        name: '',
        email: '',
        password: '',
        DOB: '1990-01-01',
        passwordConfirm: '',
        policy: false,
      });
    }
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
    if (loginData && loginData.email) {
      forgotPassword(loginData.email);
    }
  };

  return (
    //container takes styles local
    <div className={classes.container}>
      {/*------------------------ Login ----------------------- */}
      <div className={classes.wrapper}>
        <h2>Login</h2>
        <form aria-label="login-form" onSubmit={handleLogin}>
          <CustomInput
            type="email"
            name="email"
            value={loginData?.email}
            placeHolder="Enter your email"
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
            required
          />

          <CustomInput
            type="password"
            name="password"
            value={loginData?.password}
            placeHolder="Enter your password"
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
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
              checked={registerData.policy}
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

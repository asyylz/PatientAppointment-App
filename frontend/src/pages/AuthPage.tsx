import { useSelector } from 'react-redux';
import classes from './AuthPage.module.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './../store/index';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPassword, login, register } from '../store/currentUser-slice';
import ImagePicker from '../components/UI/ImagePicker';
import CustomInput from '../components/UI/CustomInput';

// const [email, setEmail] = useState<string>('aytekin@test.com');
//const [email, setEmail] = useState<string>('alice.johnson@example.com');
//const [password, setPassword] = useState<string>('newpass12');
//6946224Asy@

const AuthPage = () => {
  const [userData, setUserData] = useState<Credentials | null>({
    email: 'alice@test.com',
    password: '6946224Asy!',
    // email: '',
    // password: '',
    // email: 'aytekin@test.com',
    // password: 'newpass12',
  });

  //console.log(userData);
  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const { status } = useSelector((state: RootState) => state.currentUser);

  const { selectedDoctor } = useSelector((state: RootState) => state.doctors);

  // async yapinca test pass etmedi
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userData && userData.email && userData.password) {
      await dispatch(
        login({ email: userData.email, password: userData.password })
      );
      setUserData(null);
    } else {
      console.error('Email and password are required for login.');
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
    if (userData) {
      Object.entries(userData).forEach(([key, value]) => {
        if (value !== undefined) {
          userFormData.append(key, value.toString()); // Ensure value is a string
        }
      });
    }

    try {
      await dispatch(register(userFormData)); // Handle async action
    } catch (error) {
      console.error('Registration failed:', error); // Handle errors
    }

    setUserData(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (name === 'DOB' && type === 'date') {
      const formattedDate = new Date(`${value}T00:00:00.000Z`);
      setUserData((prevValues) => ({
        ...prevValues,
        DOB: formattedDate,
      }));
    } else if (name === 'policy' && type === 'checkbox') {
      const checkboxValue = (e.target as HTMLInputElement).checked;
      setUserData((prevValues) => ({
        ...prevValues,
        policy: checkboxValue,
      }));
    } else {
      setUserData((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };

  const handleClick = () => {
    //e: React.MouseEvent
    //e.preventDefault();
    if (userData && userData.email) {
      dispatch(forgotPassword({ email: userData.email }));
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
            value={userData?.email}
            placeHolder="Enter your email"
            onChange={handleInputChange}
            required
          />

          <CustomInput
            type="password"
            name="password"
            value={userData?.password}
            placeHolder="Enter your password"
            onChange={handleInputChange}
            required
          />
          <div className={classes.forgetPassword}>
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
            placeHolder="Enter your name"
            onChange={handleInputChange}
            required
          />

          <CustomInput
            type="email"
            name="email"
            placeHolder="Enter your email"
            onChange={handleInputChange}
            required
          />
          <CustomInput
            type="date"
            name="DOB"
            placeHolder="Enter your DOB"
            onChange={handleInputChange}
            required
          />

          <CustomInput
            type="password"
            name="password"
            placeHolder="Enter your password"
            onChange={handleInputChange}
          />
          <CustomInput
            type="password"
            name="passwordConfirm"
            placeHolder="Confirm your password"
            onChange={handleInputChange}
            required
          />
          <div className={classes.policy}>
            <input
              name="policy"
              type="checkbox"
              onChange={handleInputChange}
              required
            />
            <h3>I accept all terms & condition</h3>
          </div>
          <div className={classes.imagePickerWrapper}>
            <ImagePicker
              name="image"
              setter={setUserData}
              // defaultImage="http://localhost:3000/static/userProfileImages/userDefaultAvatar.png"
              defaultImage="https://patient-appointment-system.s3.eu-west-2.amazonaws.com/defaultUserAvatar.png"
            />
          </div>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};
export default AuthPage;

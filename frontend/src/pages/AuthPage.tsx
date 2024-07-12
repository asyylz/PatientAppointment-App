import { useSelector } from 'react-redux';
import classes from './AuthPage.module.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './../store/index';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/currentUser-slice';
import ImagePicker from '../components/UI/ImagePicker';
import CustomInput from '../components/UI/CustomInput';

const AuthPage = () => {
  // const [email, setEmail] = useState<string>('aytekin@test.com');
  const [email, setEmail] = useState<string>('alice.johnson@example.com');
  //const [password, setPassword] = useState<string>('newpass12');
  const [password, setPassword] = useState<string>('Password3!');

  const [userData, setUserData] = useState<object>({});

  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();
  const { status } = useSelector((state: RootState) => state.currentUser);

  const { selectedDoctor } = useSelector((state: RootState) => state.doctors);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (status === 'login success') {
      navigate('/user/dashboard');
    }
  }, [status, navigate, selectedDoctor]);

  const handleRegisterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userFormData = new FormData();
    // Iterate over each key-value pair in userData and append it to userFormData
    Object.entries(userData).forEach(([key, value]) => {
      userFormData.append(key, value);
    });
    // console.log(userFormData);
    // console.log(userFormData.get('image'));
  };

  console.log(userData);

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

  return (
    <div className={classes.container}>
      {/*------------------------ Login ----------------------- */}
      <div className={classes.wrapper}>
        <h2>Login</h2>
        <form action="" onSubmit={handleLogin}>
          {/* <div className={classes.inputBox}>
            <input
              type="text"
              placeholder="Enter your email"
              value="alice.johnson@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div> */}
          <CustomInput
            type="email"
            name="email"
            value="alice.johnson@example.com"
            placeHolder="Enter your email"
            onChange={handleInputChange}
          />
          {/* <div className={classes.inputBox}>
            <input
              type="password"
              placeholder="Enter your password"
              value="Password3!"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div> */}
          <CustomInput
            type="password"
            name="pasword"
            value="Password3!"
            placeHolder="Enter your password"
            onChange={handleInputChange}
          />
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
          />

          <CustomInput
            type="email"
            name="email"
            placeHolder="Enter your email"
            onChange={handleInputChange}
          />
          <CustomInput
            type="date"
            name="DOB"
            placeHolder="Enter your DOB"
            onChange={handleInputChange}
          />

          <CustomInput
            type="password"
            name="password"
            placeHolder="Enter your password"
            onChange={handleInputChange}
          />
          <CustomInput
            type="password"
            name="password"
            placeHolder="Confirm your password"
            onChange={handleInputChange}
          />
          <div className={classes.imagePickerWrapper}>
            <ImagePicker
              name="image"
              setter={setUserData}
              defaultImage="http://localhost:3000/static/userProfileImages/userDefaultAvatar.png"
              // defaultImage="/defaultUserAvatar.png"
            />
          </div>

          <div className={classes.policy}>
            <input name="policy" type="checkbox" onChange={handleInputChange} />
            <h3>I accept all terms & condition</h3>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};
export default AuthPage;

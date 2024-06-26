import { useSelector } from 'react-redux';
import classes from './AuthPage.module.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './../store/index';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setImagePath } from '../store/currentUser-slice';

const AuthPage = () => {
  const [email, setEmail] = useState<string>('aytekin@test.com');
  //const [email, setEmail] = useState<string>('alice.johnson@example.com');
  const [password, setPassword] = useState<string>('newpass12');
  //const [password, setPassword] = useState<string>('Password3!');

  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();
  const { token, userData, status, image, error } = useSelector(
    (state: RootState) => state.currentUser
  );

  const { selectedDoctor } = useSelector((state: RootState) => state.doctors);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (userData?.role === 'patient') {
      dispatch(setImagePath('./user-avatar.png'));
      return;
    } else if (userData?.role === 'doctor') {
      dispatch(setImagePath('./doctor.png'));
      return;
    }
  }, [userData?.role, dispatch]);

  useEffect(() => {
    if (status === 'login success') {
      navigate(-1);
    }
  }, [status, navigate, selectedDoctor]);

  return (
    <div className={classes.container}>
      {/*------------------------ Login ----------------------- */}
      <div className={classes.wrapper}>
        <h2>Login</h2>
        <form action="" onSubmit={handleLogin}>
          <div className={classes.inputBox}>
            <input
              type="text"
              placeholder="Enter your email"
              //value={email}
              value="alice.johnson@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={classes.inputBox}>
            <input
              type="password"
              placeholder="Enter your password"
              //value={password}
              value="Password3!"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className={`${classes.inputBox} ${classes.button}`}>
            <input type="submit" value="Login" />
          </div>
        </form>
      </div>

      {/*------------------------ Register ----------------------- */}
      <div className={classes.wrapper}>
        <h2>Registration</h2>
        <form action="">
          <div className={classes.inputBox}>
            <input type="text" placeholder="Enter your name" required />
          </div>
          <div className={classes.inputBox}>
            <input type="text" placeholder="Enter your email" required />
          </div>
          <div className={classes.inputBox}>
            <input type="password" placeholder="Create password" required />
          </div>
          <div className={classes.inputBox}>
            <input type="password" placeholder="Confirm password" required />
          </div>
          <div className={classes.policy}>
            <input type="checkbox" />
            <h3>I accept all terms & condition</h3>
          </div>
          <div className={`${classes.inputBox} ${classes.button}`}>
            <input type="submit" value="Register Now" />
          </div>
        </form>
      </div>
    </div>
  );
};
export default AuthPage;

import { useSelector } from 'react-redux';
import classes from './AuthPage.module.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './../store/index';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setImagePath } from '../store/currentUser-slice';

const AuthPage = () => {
  const [email, setEmail] = useState<string>('aytekin@test.com');
  const [password, setPassword] = useState<string>('newpass1');

  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();
  const { token, data, status, image, error } = useSelector(
    (state: RootState) => state.currentUser
  );

  const { selectedDoctor } = useSelector((state: RootState) => state.doctors);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    if (data?.currentUser?.role === 'patient') {
      dispatch(setImagePath('./public/user-avatar.png'));
      return;
    } else if (data?.currentUser?.role === 'doctor') {
      dispatch(setImagePath('./public/doctor.png'));
      return;
    }
  }, [data?.currentUser?.role, dispatch]);

  useEffect(() => {
    if (status === 'login success') {
      if (selectedDoctor) {
        navigate(`/doctors/${selectedDoctor._id}`);
      } else {
        navigate('/dashboard');
      }
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
              value="aytekin@test.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={classes.inputBox}>
            <input
              type="password"
              placeholder="Enter your password"
              //value={password}
              value="newpass12"
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

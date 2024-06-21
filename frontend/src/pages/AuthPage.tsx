import { useSelector } from 'react-redux';
import classes from './AuthPage.module.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from './../store/index';
import { loginCurrentUser } from '../store/currentUser-slice';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch: AppDispatch = useDispatch();

  const navigate = useNavigate();
  const {
    entities: { token, data },
    status,
    error,
  } = useSelector((state: RootState) => state.currentUser);

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(loginCurrentUser({ email, password }));
  };

  useEffect(() => {
    if (status === 'succeeded') {
      console.log(status);
      navigate('/');
    }
  }, [status, navigate]);

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={classes.inputBox}>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
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

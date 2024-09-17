import React from 'react';
import classes from './Navbar.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { performLogout } from '../../store/currentUser-slice/currentUser-slice';
import { AppDispatch } from '../../store/index';

const NavBar: React.FC = () => {
  const { token, userData } = useSelector(
    (state: RootState) => state.currentUser
  );
  const dispatch: AppDispatch = useDispatch();

  const handleLogout = async () => {
    if (token) await dispatch(performLogout());
  };

  return (
    <nav className={classes.navbar}>
      <a
        className={`${classes['navbar__link']} ${classes['navbar__link--logo']}`}
      >
        <img
          src="https://patient-appointment-system.s3.eu-west-2.amazonaws.com/PAS-LOGO.png"
          alt=""
        />
      </a>
      <a href="/" className={classes['navbar__link']}>
        HOME
      </a>
      <a className={classes['navbar__link']}>DOCTORS</a>
      <a className={classes['navbar__link']}>DEPARTMENTS</a>
      <a className={classes['navbar__link']}>GALERIA</a>
      <a href="/contact" className={classes['navbar__link']}>
        CONTACT
      </a>

      {token && (
        <a
          className={`${classes['navbar__link']} ${classes['navbar__link--login']}`}
          onClick={handleLogout}
        >
          LOG OUT
        </a>
      )}
      {!token && (
        <a
          className={`${classes['navbar__link']} ${classes['navbar__link--login']}`}
          href="/auth"
        >
          LOG IN
        </a>
      )}

      {token && (
        <a
          className={`${classes['navbar__link']} ${classes['navbar__link--user']}`}
          href="/user/dashboard"
        >
          <img src={userData?.image} alt="" />
        </a>
      )}
    </nav>
  );
};

export default NavBar;

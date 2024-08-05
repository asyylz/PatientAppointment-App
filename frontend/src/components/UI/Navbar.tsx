import React from 'react';
import classes from './Navbar.module.css';
import { useSelector } from 'react-redux';
const NavBar: React.FC = () => {
  const { token, userData } = useSelector(
    (state: RootState) => state.currentUser
  );
  return (
    <nav className={classes.navbar}>
      <a
        className={`${classes['navbar__link']} ${classes['navbar__link--logo']}`}
      >
        LOGO
      </a>
      <a href="/" className={classes['navbar__link']}>
        HOME
      </a>
      <a className={classes['navbar__link']}>DOCTORS</a>
      <a className={classes['navbar__link']}>DEPARTMENTS</a>
      <a className={classes['navbar__link']}>GALERIA</a>
      <a href="/contact" className={classes['navbar__link']}>CONTACT</a>
      <a
        className={`${classes['navbar__link']} ${classes['navbar__link--login']}`}
        href="/auth"
      >
        {token !== '' ? 'LOG OUT' : 'LOG IN'}
      </a>
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

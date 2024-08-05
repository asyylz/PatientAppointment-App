import React from 'react';
import classes from './HomeLayout.module.css';
import Navbar from '../../components/UI/Navbar';
import { Outlet } from 'react-router-dom';
import Footer from '../../components/UI/Footer';
const HomeLayout: React.FC = () => {
  return (
    <div className={classes['layout__container']}>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
};

export default HomeLayout;

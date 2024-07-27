import React from 'react';
import classes from './Loader.module.css';

const Loader: React.FC = () => {
  return (
    <div className={classes.container}>
      {' '}
      <div className={classes.ldsRipple}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;

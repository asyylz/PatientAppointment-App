import React from 'react';
import classes from './Loader.module.css';

const Loader: React.FC = () => {
  return (
    <div className={classes['loader__container']}>
      {' '}
      <div className={classes['loader__ldsRipple']}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;

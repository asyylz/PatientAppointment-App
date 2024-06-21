import React from 'react';
import classes from './Dasboard.module.css';
import { useSelector } from 'react-redux';
const Dashboard: React.FC = () => {
  const {
    entities: { token, data },
    image,
    status,
    error,
  } = useSelector((state: RootState) => state.currentUser);

  return (
    <div
      //style={{ border: '3px solid green' }}
      className={classes.container}
    >
      <div className={classes.userLeftSection}>
        <div className={classes.wrapper}>
          <div className={classes.image}>
            <img src={image} alt="" />
          </div>
          <p>Welcome {data.currentUser.name}</p>
        </div>
      </div>
      <div className={classes.userRightSection}>asiye</div>
    </div>
  );
};

export default Dashboard;

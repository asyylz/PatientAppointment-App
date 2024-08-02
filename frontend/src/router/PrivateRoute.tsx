// PrivateRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { toastErrorNotify } from '../helper/ToastNotify';
import classes from './PrivateRoute.module.css';
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token, userData } = useSelector(
    (state: RootState) => state.currentUser
  );

  if (!userData || !token) {
    //toastErrorNotify('You should login');
    return (
      <div className={classes.wrapper}>
        <p>
          Please login{' '}
          <span>
            <a href="/auth">here</a>
          </span>{' '}
          to be able to see user dashboard
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

export default PrivateRoute;

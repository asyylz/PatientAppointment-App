// PrivateRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
//import classes from './PrivateRoute.module.css';
import { toastErrorNotify } from '../helper/ToastNotify';
import { redirect } from 'react-router-dom';
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token, userData } = useSelector(
    (state: RootState) => state.currentUser
  );

  if (!userData || !token) {
    toastErrorNotify('You should login');
    redirect('/');
    // return (
    //   <div className={classes.wrapper}>
    //     <p>
    //       Please login{' '}
    //       <span>
    //         <a href="/auth">here</a>
    //       </span>{' '}
    //       to be able to see user dashboard
    //     </p>
    //   </div>
    // );
  }

  return <>{children}</>;
};

export default PrivateRoute;

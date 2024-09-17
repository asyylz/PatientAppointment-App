import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import classes from './PrivateRoute.module.css';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader/Loader';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { token, userData } = useSelector(
    (state: RootState) => state.currentUser
  );
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null; // Initialize the timeoutId as null

    if (!userData || !token) {
      // Set the timeout and store the ID
      timeoutId = setTimeout(() => {
        navigate('/');
      }, 1500);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [token, userData, navigate]);

  if (!userData || !token) {
    return (
      <div className={classes['wrapper']}>
        <Loader />;
      </div>
    );
  }

  // If token is present, render the children, otherwise null is returned.
  return token ? <>{children}</> : null;
};

export default PrivateRoute;

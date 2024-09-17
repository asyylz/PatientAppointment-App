import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { toastErrorNotify } from '../helper/ToastNotify';
import { useNavigate } from 'react-router-dom';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const { token, userData } = useSelector(
    (state: RootState) => state.currentUser
  );

  useEffect(() => {
    if (!userData || !token) {
      toastErrorNotify('You should login!');
      navigate('/');
    }
  }, [token, userData, navigate]);

  // If token is present, render the children, otherwise null is returned.
  return token ? <>{children}</> : null;
};

export default PrivateRoute;

// PrivateRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { toastErrorNotify } from '../helper/ToastNotify';
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token, userData } = useSelector(
    (state: RootState) => state.currentUser
  );

  if (!userData || !token) {
    toastErrorNotify('You should login');
    return <p>Please login to be able to see this page</p>; // Render nothing or a loading indicator while redirecting
  }

  return <>{children}</>;
};

export default PrivateRoute;

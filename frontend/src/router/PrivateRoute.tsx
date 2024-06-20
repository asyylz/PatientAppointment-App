// PrivateRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const {
    entities: { token, currentUser },
    status,
    error,
  } = useSelector((state: RootState) => state.currentUser);

  if (!currentUser || !token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;

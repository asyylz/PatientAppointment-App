// PrivateRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, redirect } from 'react-router-dom';

const PrivateRoute: React.FC = () => {
  const {
    entities: { token, currentUser },
    status,
    error,
  } = useSelector((state: RootState) => state.currentUser);

  console.log('asiye');
  if (!currentUser && !token) {
    redirect('/auth');
  }

  return <Outlet />;
};

export default PrivateRoute;

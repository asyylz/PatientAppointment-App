// PrivateRoute.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, redirect } from 'react-router-dom';
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const {
    entities: { token, currentUser },
    status,
    error,
  } = useSelector((state: RootState) => state.currentUser);

  console.log('asiye');
  if (!currentUser && !token) {

    redirect('/auth');
  }

  return (
    <>
      {children}
      <Outlet />
    </>
  );
};

export default PrivateRoute;

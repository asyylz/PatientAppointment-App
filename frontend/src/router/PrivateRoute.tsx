// PrivateRoute.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, redirect, useNavigate } from 'react-router-dom';
import ModalCustom from '../components/UI/ModalCustom';
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const {
    entities: { token, data },
    status,
    error,
  } = useSelector((state: RootState) => state.currentUser);

  useEffect(() => {
    setTimeout(() => {
      console.log('asiye')
      if (!data && !token) {
        navigate('/auth');
      }
    }, 1200);
  });

  return (
    <>
      {!data && !token ? (
        <ModalCustom>
          <p>You should login to be able to book appointment.</p>
        </ModalCustom>
      ) : (
        <>
          {children}
          <Outlet />
        </>
      )}
    </>
  );
};

export default PrivateRoute;

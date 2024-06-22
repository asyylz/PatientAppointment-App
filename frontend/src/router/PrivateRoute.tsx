// PrivateRoute.tsx
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import ModalCustom from '../components/UI/ModalCustom';
interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const navigate = useNavigate();

  const { token, data, status, error } = useSelector(
    (state: RootState) => state.currentUser
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!data && !token) {
        navigate('/auth');
      }
    }, 1200);

    return () => clearTimeout(timeoutId);
  }, [data, token, navigate]);

  return (
    <>
      {!data.currentUser && !token ? (
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

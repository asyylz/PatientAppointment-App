import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

interface PrivateRouteForRolesProps {
  allowedRole: string;
  children: React.ReactNode;
}

const PrivateRouteForRoles: React.FC<PrivateRouteForRolesProps> = ({
  allowedRole,
  children,
}) => {
  const { userData } = useSelector((state: RootState) => state.currentUser);
  //console.log(userData?.role);

  return userData && allowedRole === userData.role ? (
    <>{children}</>
  ) : (
    <Navigate to="/unauthorized" />
  );
};

export default PrivateRouteForRoles;

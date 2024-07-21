import React from 'react';
import { Outlet } from 'react-router-dom';

const DoctorsLayout: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default DoctorsLayout;

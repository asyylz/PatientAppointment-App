import React from 'react';
import { Outlet } from 'react-router-dom';

const DoctorsLayout: React.FC = () => {
  return (
    <div style={{ border: '1px solid red'}}>
      <Outlet />
    </div>
  );
};

export default DoctorsLayout;

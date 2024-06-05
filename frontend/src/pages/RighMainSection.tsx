import { Outlet } from 'react-router-dom';

const RighMainSection: React.FC = () => {
  return (
    <div style={{ border: '1px solid yellow', marginTop: '60px' }}>
      <Outlet />
    </div>
  );
};
export default RighMainSection;

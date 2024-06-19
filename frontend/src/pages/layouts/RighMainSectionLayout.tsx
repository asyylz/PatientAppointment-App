import { Outlet } from 'react-router-dom';

const RighMainSection: React.FC = () => {
  return (
    <div style={{ marginTop: '5rem' }}>
      <Outlet />
    </div>
  );
};
export default RighMainSection;

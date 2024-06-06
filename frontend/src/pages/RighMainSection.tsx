import { Outlet } from 'react-router-dom';

const RighMainSection: React.FC = () => {
  return (
    <div 
    style={{ marginTop: '60px' }}
    >
      <Outlet />
    </div>
  );
};
export default RighMainSection;

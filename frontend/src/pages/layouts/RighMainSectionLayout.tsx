import { Outlet } from 'react-router-dom';

const RighMainSectionLayout: React.FC = () => {
  return (
    <div
      style={{
        border: '5px solid purple',
        marginTop: '5rem',
        minHeight: '100%',
        backgroundColor: '#f3f0ef',
      }}
    >
      <Outlet />
    </div>
  );
};
export default RighMainSectionLayout;

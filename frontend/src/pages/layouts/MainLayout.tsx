import { Outlet } from 'react-router-dom';
import classes from './MainLayout.module.css';
import LeftSideBar from '../../components/UI/LeftSideBar';
import TopSearchBar from '../../components/UI/TopSearchBar';
import Footer from '../../components/UI/Footer';

const MainLayout: React.FC = () => {
  return (
    <div
      style={{
        //border: '5px solid purple',
        //marginTop: '5rem',
        minHeight: '100%',
        backgroundColor: '#f3f0ef',
      }}
    >
      <div
        //style={{ border: '2px solid red' }}
        className={`${classes.container} ${classes.active}`}
      >
        <div
          //style={{ border: '2px solid green' }}
          className={classes.leftSection}
        >
          <LeftSideBar />
        </div>
        <div
          // style={{ border: '5px solid green' }}
          className={classes.rightSection}
        >
          <TopSearchBar />
          <div className={classes.outletContainer}>
            <Outlet />
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};
export default MainLayout;

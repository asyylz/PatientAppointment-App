import { Outlet } from 'react-router-dom';
import classes from './MainLayout.module.css';
import LeftSideBar from '../components/LeftSideBar/LeftSideBar';
import TopSearchBar from '../components/TopSearchBar/TopSearchBar';
import Footer from '../components/Footer/Footer';

const MainLayout: React.FC = () => {
  return (
    // main container is removed  watch for diffs
    <div className={classes['main__sections--container']}>
      <section className={classes['main__section--left']}>
        <LeftSideBar />
      </section>
      <section className={classes['main__section--right']}>
        <TopSearchBar />
        <div className={classes['main__container--outlet']}>
          <Outlet />
        </div>
      </section>
      <div className={classes['main__wrapper--footer']}>
        <Footer />
      </div>
    </div>
  );
};
export default MainLayout;

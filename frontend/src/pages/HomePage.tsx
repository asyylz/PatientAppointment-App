import Footer from '../components/UI/Footer';
import LeftSideBar from '../components/UI/LeftSideBar';
import TopSearchBar from './../components/UI/TopSearchBar';
import RightSubMain from './layouts/RighMainSectionLayout';
import classes from './HomePage.module.css';

export default function HomePage() {

  return (
    <>
      <div
        //style={{ border: '2px solid red' }}
        className={classes.container}
      >
        <div
          //style={{ border: '2px solid green' }}
          className={classes.leftSection}
        >
          <LeftSideBar />
        </div>
        <div
          //style={{ border: '5px solid green' }}
          className={classes.rigthSection}
        >
          <TopSearchBar />
          <RightSubMain />
        </div>
        <Footer />
      </div>
    </>
  );
}

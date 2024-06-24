import Footer from '../components/UI/Footer';
import LeftSideBar from '../components/UI/LeftSideBar';
import TopSearchBar from './../components/UI/TopSearchBar';
import RightSubMain from './layouts/RighMainSectionLayout';
import classes from './HomePage.module.css';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { token, data, status, image } = useSelector(
    (state: RootState) => state.currentUser
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (status === 'logout success') {
      navigate('/');
    }
  }, [status, navigate]);

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

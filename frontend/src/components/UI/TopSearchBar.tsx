import { useNavigate } from 'react-router-dom';
import classes from './TopSearchBar.module.css';
import { useSelector, useDispatch } from 'react-redux';
//import { logoutSuccess } from '../../store/currentUser-slice';
import { AppDispatch } from '../../store';
import { useEffect, useState } from 'react';
import { setSearch } from '../../store/search-slice';
import { toastSuccessNotify } from './../../helper/ToastNotify';
import { performLogout } from '../../store/currentUser-slice';

const TopSearchBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const { token, userData } = useSelector(
    (state: RootState) => state.currentUser
  );
  //console.log(token)
  useEffect(() => {
    const timeout = setTimeout(() => dispatch(setSearch(searchInput)), 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch, searchInput]);

  //6946224Asy!
  const handleLogout = async () => {
    await dispatch(performLogout());
    toastSuccessNotify('Successfully logged out!');
    navigate('/');
  };

  return (
    <>
      <div className={classes['top__bar']}>
        <div className={classes['top__bar--search']}>
          <input
            className={classes['top__bar--search-input']}
            type="text"
            name="search"
            placeholder="Search here"
            onChange={(e) => setSearchInput(e.target.value)}
          />

          <div className={classes['top__bar--search-icon']}>
            <i className="fas fa-search"></i>
          </div>
        </div>

        {token && userData && (
          <div className={classes['top__bar--search-user']}>
            <h5>
              {userData?.role === 'doctor'
                ? `Dr. ${userData?.name}`
                : userData?.name}
            </h5>
            <i className="fas fa-bell"></i>
            <img src={userData.image} alt="User" />
            <button onClick={handleLogout}>Logout</button>
          </div>
          // ) : (
          //   <button onClick={() => navigate('/auth')}>Login</button>
        )}
      </div>
    </>
  );
};

export default TopSearchBar;

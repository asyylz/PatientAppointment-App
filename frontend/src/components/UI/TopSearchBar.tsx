import { useNavigate } from 'react-router-dom';
import classes from './TopSearchBar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout, logoutSuccess } from '../../store/currentUser-slice';
import { AppDispatch } from '../../store';
import { useEffect, useState } from 'react';
import { setSearch } from '../../store/search-slice';

const TopSearchBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const { token, userData } = useSelector(
    (state: RootState) => state.currentUser
  );
 // console.log(userData?.image);
  useEffect(() => {
    const timeout = setTimeout(() => dispatch(setSearch(searchInput)), 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch, searchInput]);

  const handleLogout = async () => {
    navigate('/');
    await dispatch(logout(token));
    dispatch(logoutSuccess()); // to set state to idle
  };

  return (
    <>
      <div className={classes.topBar}>
        <div className={classes.search}>
          <input
            type="text"
            name="search"
            placeholder="search here"
            onChange={(e) => setSearchInput(e.target.value)}
          />
         
            <div className={classes.searchIcon}>
              <i className="fas fa-search"></i>
            </div>
         
        </div>

        {token && userData ? (
          <div className={classes.user}>
            <h5>
              {userData?.role === 'doctor'
                ? `Dr. ${userData?.name}`
                : userData?.name}
            </h5>
            <i className="fas fa-bell"></i>
            <img
              //src={`http://localhost:3000/static${userData?.image}`}
              // src={`https://patient-appointment-system.s3.eu-west-2.amazonaws.com/${userData.image}`}
              src={userData.image}
              alt="User"
            />
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          // <GlobalLink text="Login" to="/auth" />
          <button onClick={() => navigate('/auth')}>Login</button>
        )}
      </div>
    </>
  );
};

export default TopSearchBar;

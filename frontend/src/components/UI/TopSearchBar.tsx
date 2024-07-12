import { useNavigate } from 'react-router-dom';
import classes from './TopSearchBar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/currentUser-slice';
import { AppDispatch } from '../../store';
import { useEffect, useState } from 'react';
import { setSearch } from '../../store/search-slice';
import GlobalLink from './GlobalLink';

const TopSearchBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const { token, userData } = useSelector(
    (state: RootState) => state.currentUser
  );



  useEffect(() => {
    const timeout = setTimeout(() => dispatch(setSearch(searchInput)), 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [dispatch, searchInput]);

  const handleLogout = async () => {
    navigate('/');
    await dispatch(logout(token));
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
          <label htmlFor="search">
            <div className={classes.searchIcon}>
              <i className="fas fa-search"></i>
            </div>
          </label>
        </div>

        {token && userData ? (
          <div className={classes.user}>
            <h3>
              {userData?.role === 'doctor'
                ? `Dr. ${userData?.name}`
                : userData?.name}
            </h3>
            <i className="fas fa-bell"></i>
            <img
              src={`http://localhost:3000/static${userData?.image}`}
              alt="User"
            />
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <GlobalLink text="Login" to="/auth" />
        )}
      </div>
    </>
  );
};

export default TopSearchBar;

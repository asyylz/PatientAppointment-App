import { Link } from 'react-router-dom';
import classes from './TopSearchBar.module.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/currentUser-slice';
import { AppDispatch } from '../../store';


const TopSearchBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { token, data, image } = useSelector(
    (state: RootState) => state.currentUser
  );

  const handleLogout = async () => {
    await dispatch(logout(token));
  };

  return (
    <>
      <div className={classes.topBar}>
        <div className={classes.search}>
          <input type="text" name="search" placeholder="search here" />
          <label htmlFor="search">
            <div className={classes.searchIcon}>
              <i className="fas fa-search"></i>
            </div>
          </label>
        </div>

        {token && data ? (
          <div className={classes.user}>
            <h3>{data?.currentUser?.name}</h3>
            <i className="fas fa-bell"></i>
            <img src={image} alt="" />
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link className={classes.login} to="/auth">
            Login
          </Link>
        )}
      </div>
    </>
  );
};

export default TopSearchBar;

import { Link, useNavigate } from 'react-router-dom';
import classes from './TopSearchBar.module.css';
import { useSelector } from 'react-redux';
import { currentUserActions } from './../../store/currentUser-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import useAuthCall from './../../hooks/useAuthCall';

const TopSearchBar: React.FC = () => {
  //const dispatch: AppDispatch = useDispatch();

  const { logout } = useAuthCall();
  const navigate = useNavigate();
  const {
    entities = { token: null, data: null },
    status,
    error,
    image,
  } = useSelector((state: RootState) => state.currentUser);

  const handleLogout = async () => {
    await logout();
    navigate('/');
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

        {entities?.token && entities?.data ? (
          <div className={classes.user}>
            <h3>{entities.data.currentUser.name}</h3>
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

import { Link } from 'react-router-dom';
import classes from './TopSearchBar.module.css';
import { useSelector } from 'react-redux';

const TopSearchBar: React.FC = () => {
  const {
    entities: { token, data },
    status,
    error,
  } = useSelector((state: RootState) => state.currentUser);

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
          <Link to="/logout" className={classes.user}>
            <i className="fas fa-bell"></i>
            <img src="./public/doctor.png" alt="" />
          </Link>
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

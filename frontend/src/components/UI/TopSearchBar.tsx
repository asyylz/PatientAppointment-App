import { Link } from 'react-router-dom';
import classes from './TopSearchBar.module.css';
import { useSelector } from 'react-redux';

export default function TopSeacrhBar() {
  const {
    entities: { token, currentUser },
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

        {token && currentUser ? (
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
}

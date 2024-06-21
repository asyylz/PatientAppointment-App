import { Link } from 'react-router-dom';
import classes from './TopSearchBar.module.css';
import { useSelector } from 'react-redux';
import { useCallback } from 'react';
import { currentUserActions } from './../../store/currentUser-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

const TopSearchBar: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const {
    entities: { token, data },
    status,
    error,
  } = useSelector((state: RootState) => state.currentUser);

  const pickUserImage = () => {
    if (data.currentUser.role === 'patient') {
      dispatch(currentUserActions.setImagePath('./public/user-avatar.png'));
      return './public/user-avatar.png';
    } else if (data.currentUser.role === 'doctor') {
      dispatch(currentUserActions.setImagePath('./public/doctor.png'));
      return './public/doctor.png';
    }
    return '';
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
          <Link to="/logout" className={classes.user}>
            <i className="fas fa-bell"></i>
            <img src={pickUserImage()} alt="" />
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

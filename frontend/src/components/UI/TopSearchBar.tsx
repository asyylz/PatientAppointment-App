import classes from './TopSearchBar.module.css';

export default function TopSeacrhBar() {
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
        <i className="fas fa-bell"></i>
        <div className={classes.user}>
          <img src="./public/doctor.png" alt="" />
        </div>
      </div>
    </>
  );
}

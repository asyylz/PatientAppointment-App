//import './left-sidebar.css';
import { Link } from 'react-router-dom';
import classes from './LeftSideBar.module.css';
import { useSelector } from 'react-redux';
import { useState } from 'react';
const sideBarSectionList = [
  { title: 'Dashboard', icon: 'fas fa-th-large' },
  { title: 'Profile Settings', icon: 'fas fa-cog' },
  // { title: 'Appointments', icon: 'fas fa-stethoscope' },
  {
    title: 'Doctors',
    url: '?limit=2&page=1&sort=firstName',
    icon: 'fas fa-user-md',
  },
  {
    title: 'Departments',
    url: '?limit=24&page=1&sort=departmentMain',
    icon: 'fas fa-puzzle-piece',
  },
  // { title: 'Payments', icon: 'fas fa-hand-holding-usd' },
  // { title: 'Help', icon: 'fas fa-question' },
];
export default function LeftSideBar() {
  const { userData } = useSelector((state: RootState) => state.currentUser);
  const [activeItem, setActiveItem] = useState(null);

  const handleItemClick = (item) => {
    setActiveItem(item);
  };
  return (
    <div className={classes['sidebar__container']}>
      <ul>
        <li className={classes['sidebar__item']}>
          <Link to="/" className={classes['sidebar__item-link']}>
            <div className={classes['sidebar__logo']}>
              <img src="/public/PAS-LOGO.png" alt="" />
            </div>
            <div className={classes['link__home']}>Home</div>
          </Link>
        </li>
        {sideBarSectionList.map((section) => {
          return (
            <li
              id={section.title}
              className={`${classes.sidebar__item} ${
                activeItem === section.title ? classes.active : ''
              }`}
              key={section.title}
              onClick={() => handleItemClick(section.title)}
              data-for={section.title}
            >
              <Link
                className={classes['sidebar__item-link']}
                to={`/user/${section.title.split(' ').join('').toLowerCase()}${
                  section.url ? `${section.url}` : ''
                }`}
              >
                <div className={classes['icon__box']}>
                  <i className={section.icon}></i>
                </div>
                <div className={classes['icon__box-title']}>
                  {section.title}
                </div>
              </Link>
            </li>
          );
        })}
        {userData?.role === 'doctor' && (
          <li key="appointments">
            <Link to="/user/appointments">
              <div className={classes['icon__box']}>
                <i className="fas fa-stethoscope"></i>
              </div>
              <div className={classes['icon__box-title']}>Appointments</div>
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

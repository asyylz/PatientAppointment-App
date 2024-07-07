//import './left-sidebar.css';
import { Link } from 'react-router-dom';
import classes from './LeftSideBar.module.css';
import { useSelector } from 'react-redux';
const sideBarSectionList = [
  { title: 'HOSPITAL', icon: 'fas fa-clinic-medical' },
  { title: 'Dashboard', icon: 'fas fa-th-large' },
  // { title: 'Appointments', icon: 'fas fa-stethoscope' },
  { title: 'Doctors', icon: 'fas fa-user-md' },
  { title: 'Departments', icon: 'fas fa-puzzle-piece' },
  { title: 'Payments', icon: 'fas fa-hand-holding-usd' },
  { title: 'Settings', icon: 'fas fa-cog' },
  { title: 'Help', icon: 'fas fa-question' },
];
export default function LeftSideBar() {
  const { token, userData, status, image, error } = useSelector(
    (state: RootState) => state.currentUser
  );
  return (
    <>
      <div className={classes.sidebar}>
        <ul>
          {sideBarSectionList.map((section) => {
            return (
              <li key={section.title}>
                <Link to={`/user/${section.title.toLowerCase()}`}>
                  <div className={classes.iconBox}>
                    <i className={section.icon}></i>
                  </div>
                  <div className={classes.title}>{section.title}</div>
                </Link>
              </li>
            );
          })}
          {userData?.role === 'doctor' && (
            <li key="appointments">
              <Link to="/user/appointments">
                <div className={classes.iconBox}>
                  <i className="fas fa-stethoscope"></i>
                </div>
                <div className={classes.title}>Appointments</div>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

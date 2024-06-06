import './left-sidebar.css';
import { Link } from 'react-router-dom';
const sideBarSectionList = [
  { title: 'Brand Name', icon: 'fas fa-clinic-medical' },
  { title: 'Dashboard', icon: 'fas fa-th-large' },
  { title: 'Appointments', icon: 'fas fa-stethoscope' },
  { title: 'Doctors', icon: 'fas fa-user-md' },
  { title: 'Departments', icon: 'fas fa-puzzle-piece' },
  { title: 'Payments', icon: 'fas fa-hand-holding-usd' },
  { title: 'Settings', icon: 'fas fa-cog' },
  { title: 'Help', icon: 'fas fa-question' },
];
export default function LeftSideBar() {
  return (
    <>
      <div className="sidebar">
        <ul>
          {sideBarSectionList.map((section) => {
            return (
              <li key={section.title}>
                <Link to={section.title.toLowerCase()}>
                  <div className="iconBox">
                    <i className={section.icon}></i>
                  </div>

                  <div className="title">{section.title}</div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

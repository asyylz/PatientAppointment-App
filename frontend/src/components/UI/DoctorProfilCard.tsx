import { useSelector } from 'react-redux';
import classes from './DoctorProfileCard.module.css';
import { Link } from 'react-router-dom';
import { RootState } from './../../store/index';

interface DoctorProfilCardProps {
  doctor: Doctor;
}

const DoctorProfilCard: React.FC<DoctorProfilCardProps> = ({ doctor }) => {
  const { entities: departments } = useSelector(
    (state: RootState) => state.departments
  );

  console.log(doctor);
  console.log(departments);

  const department: Department | undefined = departments.find(
    (department) => String(department._id) === doctor.departmentId
  );
  return (
    <div
      className={classes.cardContainer}
      //style={{ border: '1px solid red' }}
    >
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className={classes.ourTeam}>
          <div className={classes.picture}>
            {/* <img src={doctor.image} /> */}
            <img src="https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*" />
          </div>
          <div>
            <div>
              <h3
                className={classes.name}
              >{`${doctor.firstName} ${doctor.lastName}`}</h3>
              <h4 className={classes.title}>{department?.departmentMain}</h4>
            </div>
            <ul className={classes.social}>
              <li className={classes.iconBox}>
                <Link to="" className={classes.link}>
                  <i className="fas fa-envelope"></i>
                </Link>
              </li>
              <li className={classes.iconBox}>
                <Link to="" className={classes.link}>
                  <i className="fab fa-facebook"></i>
                </Link>
              </li>
              <li className={classes.iconBox}>
                <Link to="" className={classes.link}>
                  <i className="fab fa-linkedin "></i>
                </Link>
              </li>
              <li className={classes.iconBox}>
                <Link to="" className={classes.link}>
                  <i className="fab fa-instagram"></i>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilCard;

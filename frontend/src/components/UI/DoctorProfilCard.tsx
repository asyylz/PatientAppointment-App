import classes from './DoctorProfileCard.module.css';
import { Link } from 'react-router-dom';

interface DoctorProfilCardProps {
  doctor: Doctor;
  onSelectDoctor: (doctor: Doctor) => void;
}

const DoctorProfilCard: React.FC<DoctorProfilCardProps> = ({
  doctor,
  onSelectDoctor,
}) => {
  
  return (
    <div
      key={doctor._id.toString()}
      className={classes.cardContainer}
      //style={{ border: '1px solid red' }}
    >
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div
          //style={{ border: '1px solid blue' }}
          className={classes.ourTeam}
        >
          <div className={classes.picture}>
            {/* <img src={doctor.image} /> */}
            <img src="https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*" />
          </div>
          <div>
            <div>
              <h3
                className={classes.name}
              >{`${doctor.firstName} ${doctor.lastName}`}</h3>
              <h4 className={classes.title}>
                {doctor.departmentId.departmentMain}
              </h4>
            </div>
            <div
              //style={{ border: '1px solid blue' }}
              className={classes.action}
            >
              <Link
                to={doctor._id.toString()}
                onClick={() => onSelectDoctor(doctor as Doctor)}
              >
                Make Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilCard;

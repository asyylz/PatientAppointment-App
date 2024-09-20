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
      role="doctor"
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
            <img
              src={
                doctor.userId?.image
                  ? doctor.userId?.image
                  : 'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*'
              }
            />
          </div>

          <div>
            <h4
              className={classes.name}
            >{`Dr ${doctor.firstName} ${doctor.lastName}`}</h4>
            <h4 className={classes.department}>
              {doctor.departmentId.departmentMain}
            </h4>
          </div>

          <Link
            to={doctor._id.toString()}
            onClick={() => onSelectDoctor(doctor as Doctor)}
          >
            Make Appointment
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilCard;

import classes from './DoctorProfileCard.module.css';

interface DoctorProfilCardProps {
  doctor: Doctor;
}

const DoctorProfilCard: React.FC<DoctorProfilCardProps> = () => {
  return (
    <div
      className={classes.cardContainer}
      //style={{ border: '1px solid red' }}
    >
      <div className="col-12 col-sm-6 col-md-4 col-lg-3">
        <div className={classes.ourTeam}>
          <div className={classes.picture}>
            <img src="https://picsum.photos/130/130?image=1027" />
          </div>
          <div>
            <div>
              <h3 className={classes.name}>Michele Miller</h3>
              <h4 className={classes.title}>Web Developer</h4>
            </div>
            <ul className={classes.social}>
              <li className={classes.iconBox}>
                <a href="">
                  <i className="fas fa-envelope"></i> {/* Facebook Icon */}
                </a>
              </li>
              <li className={classes.iconBox}>
                <a href="">
                  <i className="fab fa-facebook"></i>
                </a>
              </li>
              <li className={classes.iconBox}>
                <a href="">
                  <i className="fab fa-linkedin "></i>
                </a>
              </li>
              <li className={classes.iconBox}>
                <a href="">
                  <i className="fab fa-instagram"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfilCard;

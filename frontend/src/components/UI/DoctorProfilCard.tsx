import classes from './DoctorProfileCard.module.css';

const DoctorProfilCard = () => {
  return (
    <a href="" className={classes.doctorsProfileCard}>
      <img src="" className={classes.cardImage} alt="" />
      <div className={classes.cardOverlay}>
        <div className={classes.cardHeader}>
          <svg className={classes.cardArc} xmlns="http://www.w3.org/2000/svg">
            <path d="M 40 80 c 22 0 40 -22 40 -40 v 40 Z" />
          </svg>
          <img className={classes.cardThumb} src="" alt="" />
          <div className={classes.cardHeadertext}>
            <h2 className={classes.cardTitle}>{}</h2>
            <h3>{}</h3>
          </div>
        </div>
        <p className={classes.cardDescription}>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores,
          blanditiis?
        </p>
      </div>
    </a>
  );
};

export default DoctorProfilCard;

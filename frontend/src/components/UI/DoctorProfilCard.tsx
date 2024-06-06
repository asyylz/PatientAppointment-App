import classes from './DoctorProfileCard.module.css';

interface DoctorProfilCardProps {
  doctor: Doctor;
}

const DoctorProfilCard: React.FC<DoctorProfilCardProps> = () => {
  return (
    <a href="" className={classes.doctorsProfileCard}>
      <img
        src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        className={classes.cardImage}
        alt=""
      />
      <div className={classes.cardOverlay}>
        <div className={classes.cardHeader}>
          <svg className={classes.cardArc} xmlns="http://www.w3.org/2000/svg">
            <path d="M 40 80 c 22 0 40 -22 40 -40 v 40 Z" />
          </svg>
          <img
            className={classes.cardThumb}
            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt=""
          />
          <div className={classes.cardHeaderText}>
            <h2 className={classes.cardTitle}>Asiye</h2>
            <h3>Cardiology</h3>
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

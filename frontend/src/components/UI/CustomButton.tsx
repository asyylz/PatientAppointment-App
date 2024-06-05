import { FaUserDoctor } from 'react-icons/fa6';
import classes from './CustomButton.module.css';
const button: React.FC = () => {
  return (
    <div
      className={classes.card}
      //style={{ border: '1px solid red', marginTop: '2rem' }}
    >
      <div className={classes.cardName}>Departments</div>

      <div className={classes.iconBox}>
        <FaUserDoctor />
      </div>
    </div>
  );
};

export default button;

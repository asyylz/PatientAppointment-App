import { FaUserDoctor } from 'react-icons/fa6';
import classes from './CustomButton.module.css';

interface CustomButtonProps {
  department: Department;
}
const customButton: React.FC<CustomButtonProps> = ({ department }) => {
  return (
    <div
      className={classes.card}
      //style={{ border: '1px solid red', marginTop: '2rem' }}
    >
      <div className={classes.cardName}>{department.departmentMain}</div>

      <div className={classes.iconBox}>
        <FaUserDoctor />
      </div>
    </div>
  );
};

export default customButton;

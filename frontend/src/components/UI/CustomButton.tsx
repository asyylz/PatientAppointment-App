import { Link } from 'react-router-dom';
import classes from './CustomButton.module.css';

interface CustomButtonProps {
  department: Department;
}
const customButton: React.FC<CustomButtonProps> = ({ department }) => {
  return (
    <div
      className={classes.wrapper}
      // style={{ border: '3px solid green' }}
    >
      <div
        className={classes.card}
        //style={{ border: '1px solid red', marginTop: '2rem' }}
      >
        <div className={classes.cardName}>{department?.departmentMain}</div>
      </div>

      <div
      //style={{ border: '1px solid red' }}
      >
        <ul className={classes.subDepartmentsContainer}>
          {department?.departmentSub?.map((el: string, index: number) => (
            <li className={classes.subDepartment} key={index}>
              <Link to="">{el}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default customButton;

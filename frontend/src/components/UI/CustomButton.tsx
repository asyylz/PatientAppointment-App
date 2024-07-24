import { Link, useNavigate } from 'react-router-dom';
import classes from './CustomButton.module.css';

interface CustomButtonProps {
  department: Department;
}
const CustomButton: React.FC<CustomButtonProps> = ({ department }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    //navigate(`/user/doctors?departmentId=${department._id}`);
    navigate(
      `/user/doctors?limit=2&page=1&sort=firstName&departmentId=${department._id}`
    );
  };

  return (
    <div
      className={classes.wrapper}
      // style={{ border: '3px solid green' }}
    >
      <div
        className={classes.card}
        //style={{ border: '1px solid red', marginTop: '2rem' }}
      >
        <div className={classes.cardName} onClick={handleClick}>
          {department?.departmentMain}
        </div>
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

export default CustomButton;

import { Link, useNavigate } from 'react-router-dom';
import classes from './DepartmentButton.module.css';

interface CustomButtonProps {
  department: Department;
}
const CustomButton: React.FC<CustomButtonProps> = ({ department }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(
      `/user/doctors?limit=2&page=1&sort=firstName&departmentId=${department._id}`
    );
  };

  return (
    <div role="department" className={classes['department__wrapper']}>
      <div className={classes['department__button']}>
        <div
          className={classes['department__button--name']}
          onClick={handleClick}
        >
          {department?.departmentMain}
        </div>
      </div>

      <div>
        <ul className={classes['department__sub-wrapper']}>
          {department?.departmentSub?.map((el: string, index: number) => (
            <li className={classes['department__sub--item']} key={index}>
              <Link to="">{el}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomButton;

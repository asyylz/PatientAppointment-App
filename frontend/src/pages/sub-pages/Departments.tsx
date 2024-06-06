import CustomButton from '../../components/UI/CustomButton';
import classes from './Department.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './../../store/index';
import { fetchDepartments } from './../../store/departments-slice';
import { useEffect } from 'react';

const Departments: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { departments, status, error } = useSelector(
    (state: RootState) => state.departments
  );

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchDepartments());
    }
  }, [status, dispatch]);

  return (
    <>
      <h1 className={classes.header}>DEPARTMENTS</h1>
      <hr />
      <div
        className={classes.container}
        //style={{ border: '2px solid red' }}
      >
        {status === 'loading' && <p>Loading...</p>}
        {status === 'succeeded' &&
          departments.map((department) => (
            <CustomButton
              key={department._id}
              department={department as Department}
            />
          ))}
        {status === 'failed' && <p>{error}</p>}
      </div>
    </>
  );
};

export default Departments;

import CustomButton from '../../components/DepartmentButton/DepartmentButton';
import classes from './Department.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './../../store/index';
import { fetchDepartments } from '../../store/departments-slice/departments-slice';
import { useEffect, useState } from 'react';
const apiURL =
  import.meta.env.VITE_NODE_ENV === 'production'
    ? import.meta.env.VITE_SERVER_URL
    : import.meta.env.VITE_LOCAL_URL;

const Departments: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const {
    entities: departments,
    status,
    error,
  } = useSelector((state: RootState) => state.departments);

  const [filteredDepartments, setFilteredDepartments] = useState(departments);

  const searchWord = useSelector((state: RootState) => state.search);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(
        fetchDepartments(
          `${apiURL}/departments?limit=24&page=1&sort=departmentMain`
        )
      ); // sending empty argument since it is optional
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (searchWord) {
      const filtered = departments
        .filter(
          (department: Department) =>
            department.departmentMain
              .toLowerCase()
              .includes(searchWord.toLowerCase()) ||
            department.departmentSub.some((sub) =>
              sub.toLowerCase().includes(searchWord.toLowerCase())
            )
        )
        .sort((a: Department, b: Department) => {
          const aMainIncludes = a.departmentMain
            .toLowerCase()
            .includes(searchWord.toLowerCase());
          const bMainIncludes = b.departmentMain
            .toLowerCase()
            .includes(searchWord.toLowerCase());

          if (aMainIncludes && !bMainIncludes) {
            return -1; // `a` should come before `b`
          } else if (!aMainIncludes && bMainIncludes) {
            return 1; // `b` should come before `a`
          } else {
            return 0; // keep the order as is
          }
        });

      setFilteredDepartments(filtered);
    } else {
      setFilteredDepartments(departments);
    }
  }, [searchWord, departments]);

  return (
    <div
      className={classes.mainWrapper}
      //style={{ border: '1px solid red' }}
    >
      <div
        //style={{border:'3px solid green'}}
        className={classes.headerWrapper}
      >
        <h2
        //style={{border:'1px solid red'}}
        >
          DEPARTMENTS
        </h2>
        <hr />
      </div>

      <div
        className={classes.container}
        role="departments-container"
        //style={{ border: '2px solid red' }}
      >
        {status === 'loading' && <p>Departments loading...</p>}

        {status === 'succeeded' &&
          filteredDepartments.map((department: Department) => (
            <CustomButton key={department._id} department={department} />
          ))}
        {status === 'failed' && <p>{error}</p>}
      </div>
    </div>
  );
};

export default Departments;

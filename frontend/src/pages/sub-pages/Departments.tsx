import { useEffect, useState } from 'react';
import CustomButton from '../../components/UI/CustomButton';
import classes from './Department.module.css';
import axios from 'axios';

interface Profession {
  id: number;
  name: string;
}

const Departments: React.FC = () => {
  useEffect(() => {
    getAllProfessions();
  }, []);

  const [data, setData] = useState<Profession[] | null>(null);

  const getAllProfessions = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/v1/departments'
      );
      console.log(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className={classes.container} style={{ border: '2px solid red' }}>
      <CustomButton />
      <CustomButton />
      <CustomButton />
    </div>
  );
};

export default Departments;

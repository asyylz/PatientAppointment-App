import { useEffect, useState } from 'react';
import classes from './HomePage.module.css';
import { useSelector } from 'react-redux';
import { fetchDoctors } from './../store/doctors-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

const images: { [key: string]: string } = {
  one: 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8aGVhbHRofGVufDB8fDB8fHwy',
  two: 'https://images.unsplash.com/photo-1488228469209-c141f8bcd723?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGhlYWx0aHxlbnwwfHwwfHx8Mg%3D%3D',
  three:
    'https://images.unsplash.com/photo-1444312645910-ffa973656eba?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aGVhbHRofGVufDB8fDB8fHwy',
  four: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  five: 'https://images.unsplash.com/photo-1604881991720-f91add269bed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mjc1fHxoZWFsdGh8ZW58MHx8MHx8fDI%3D',
};
export default function HomePage() {
  const dispatch: AppDispatch = useDispatch();
  const {
    entities: doctors,
    // status,
    // error,
  } = useSelector((state: RootState) => state.doctors);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    dispatch(
      fetchDoctors(
        'http://localhost:3000/api/v1/doctors?limit=4&page=1&sort=firstName'
      )
    );
  }, [dispatch]);

  useEffect(() => {
    const imageKeys = Object.keys(images);
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageKeys.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  // console.log(token);
  return (
    <div className={classes.wrapper}>
      <div className={`${classes.container} ${classes['container--body']}`}>
      
        <section
          className={`${classes.container} ${classes['container--section1']}`}
        >
          <div className={classes.description}>
            <div className={classes['description__item--one']}></div>
            <div className={classes['description__item--two']}>
              <h1 className={classes['description__title']}>
                THE LEADER IN CARING YOU...
              </h1>
              <p className={classes['description__text']}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
                maiores possimus rerum delectus magni cupiditate nostrum, ipsa,
                quasi odio facere fuga ea dicta cum debitis in ducimus
                doloremque quod magnam.
              </p>
            </div>
          </div>
        </section>
        <section
          className={`${classes.container} ${classes['container--section2']}`}
        >
          <h1 className={classes['section2__title']}>DISCOVER </h1>
          <a className={classes['section2__title--underline']}>MORE</a>
        </section>
        <section className={classes.galeria}>
          <div className={classes['galeria__images']}>
            {Object.entries(images).map(([key, value], index) => (
              <img
                className={`${classes['galeria__image']} ${
                  classes[`galeria__image--${key}`]
                } ${
                  index === currentImageIndex
                    ? classes['galeria__image--fade']
                    : ''
                }`}
                key={key}
                src={value}
                alt={key}
                loading="lazy"
              />
            ))}
          </div>
        </section>
        <section
          className={`${classes.container} ${classes['container--section3']}`}
        >
          <h1 className={classes['section3__title']}>MEET OUR DOCTORS</h1>
        </section>
        <section
          className={`${classes.container} ${classes['container--section4']}`}
        >
          <div className={classes['section4--carousel']}>
            {doctors.map((doctor: Doctor) => (
              <div className={classes['carousel__card']} key={doctor.id}>
                <div className={classes['carousel__picture']}>
                  <img
                    src={
                      doctor.userId?.image
                        ? doctor.userId?.image
                        : 'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*'
                    }
                    alt={`Dr ${doctor.firstName} ${doctor.lastName}`}
                  />
                </div>
                <div className={classes['carousel__info']}>
                  <h1
                    className={classes['carousel__doctorName']}
                  >{`Dr ${doctor.firstName} ${doctor.lastName}`}</h1>
                  <h1 className={classes['carousel__doctorDepartment']}>
                    {doctor.departmentId.departmentMain}
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

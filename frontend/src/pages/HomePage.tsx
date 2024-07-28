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

  //console.log(doctors);

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

  return (
    <div className={classes.wrapper}>
      <div className={`${classes.container} ${classes.body}`}>
        <nav className={classes.navbar}>
          <a>LOGO</a>
          <a>DISCOVER MORE</a>
          <a>DOCTORS</a>
          <a>DEPARTMENTS</a>
          <a>GALERIA</a>
          <a>CONTACT</a>
          <a className={classes.login} href="/auth">
            LOG IN
          </a>
        </nav>
        <section className={`${classes.container} ${classes.section1}`}>
          <div className={classes.description}>
            <div></div>
            <div>
              <h1>THE LEADER IN CARING YOU...</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos
                maiores possimus rerum delectus magni cupiditate nostrum, ipsa,
                quasi odio facere fuga ea dicta cum debitis in ducimus
                doloremque quod magnam.
              </p>
            </div>
          </div>
        </section>
        <section className={`${classes.container} ${classes.section2}`}>
          <h1>
            DISCOVER <span>MORE</span>
          </h1>
        </section>
        <section className={classes.galeria}>
          <div className={`${classes.images}`}>
            {Object.entries(images).map(([key, value], index) => (
              <img
                className={`${classes.image} ${classes[key]} ${
                  index === currentImageIndex ? classes['fade'] : ''
                }`}
                key={key}
                // src={images[imageKeys[(index + currentIndex) % imageKeys.length]]}
                src={value}
                alt={key}
              />
            ))}
          </div>
        </section>
        <section className={`${classes.container} ${classes.section2}`}>
          <h1>MEET OUR DOCTORS</h1>
        </section>
        <section className={classes.section4}>
          <div className={classes.carousel}>
            {doctors.map((doctor: Doctor) => (
              <div className={classes.card}>
                <div className={classes.picture}>
                  <img
                    src={
                      doctor.userId?.image
                        ? doctor.userId?.image
                        : 'https://hips.hearstapps.com/hmg-prod/images/portrait-of-a-happy-young-doctor-in-his-clinic-royalty-free-image-1661432441.jpg?crop=0.66698xw:1xh;center,top&resize=1200:*'
                    }
                  />
                </div>
                <div>
                  <h1>{`Dr ${doctor.firstName} ${doctor.lastName}`}</h1>
                  <h1>{doctor.departmentId.departmentMain}</h1>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className={classes.footer}>
          <div className={classes.subscribe}>
            <input type="text" placeholder="Enter your email address..." />
            <button>SUBCRIBE</button>
          </div>
          <div className={classes.links}>
            <div className={classes.box}>
              <h1>Discover</h1>
              <p>
                Read week of the blog post... <a href="">here</a>
              </p>
            </div>
            <div className={classes.box}>
              <h1>About</h1>
              <ul>
                <li>Staff</li>
                <li>Team</li>
                <li>Careers</li>
                <li>Blog</li>
              </ul>
            </div>
            <div className={classes.box}>
              <h1>Resources</h1>
              <ul>
                <li>Security</li>
                <li>Global</li>
                <li>Privacy</li>
              </ul>
            </div>
            <div className={classes.box}>
              <h1>Social</h1>
              <ul>
                <li>Facebook</li>
                <li>Instagram</li>
                <li>Twitter</li>
                <li>GooglePlus</li>
              </ul>
            </div>
          </div>
          <div className={classes.partners}>
            <div>
              <p>Our Partners:</p>
              <ul>
                <li>Company 1</li>
                <li>Company 2</li>
                <li>Company 3</li>
                <li>Company 4</li>
              </ul>
            </div>

            <a href="">See all</a>
          </div>
        </div>
      </div>
    </div>
  );
}

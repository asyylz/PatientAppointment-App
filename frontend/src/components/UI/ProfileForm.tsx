import React, { useEffect, useState } from 'react';
import classes from './ProfileForm.module.css';
import CustomInput from './CustomInput';
import { useSelector } from 'react-redux';
import { formatDateForInput } from '../../helper/generateDates';
import useHttp from './../../hooks/useHttp';
import { login, updateUserInfo } from '../../store/currentUser-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';

const ProfileForm: React.FC = () => {
  //const { updateUserInfo, getUserInfo } = useHttp();

  const dispatch: AppDispatch = useDispatch();
  const { userData, status, image, token } = useSelector(
    (state: RootState) => state.currentUser
  );
  const [updatedUserData, setUpdatedUserData] = useState<object>({});

  // useEffect(() => {
  //   if (userData) {
  //     getUserInfo(userData._id);
  //   }
  // }, [updateUserInfo]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === 'DOB') {
      const formattedDate = new Date(`${value}T00:00:00.000Z`);
      console.log(formattedDate);
      setUpdatedUserData((prevValues) => ({
        ...prevValues,
        DOB: formattedDate,
      }));
    } else {
      setUpdatedUserData((prevValues) => ({
        ...prevValues,
        [name]: value,
      }));
    }
  };
  console.log(updatedUserData);

  const updateInfo = () => {
    dispatch(updateUserInfo({ updatedUserData, token }));
    // if (userData) {
    //   getUserInfo(userData._id);
    // }
    setUpdatedUserData({});
  };

  if (status === 'loading') <p>Loading...</p>;

  return (
    userData && (
      <div className={classes.container}>
        <div className={classes.wrapper}>
          <div className={classes.imageWrapper}>
            <div className={classes.image}>
              <img src={image} alt="" />
            </div>
            <button>Upload Avatar</button>
          </div>
        </div>

        <div className={classes.infoWrapper}>
          <CustomInput
            defaultValue={userData?.name}
            type="text"
            name="name"
            placeHolder="Enter your name"
            onChange={handleInputChange}
          />
          <CustomInput
            defaultValue={userData.email}
            type="text"
            name="email"
            placeHolder="Enter your email"
            onChange={handleInputChange}
          />
          <CustomInput
            defaultValue={formatDateForInput(userData.DOB)}
            type="date"
            name="DOB"
            placeHolder="Enter your DOB"
            onChange={handleInputChange}
          />
          <div className={classes.buttonWrapper}>
            <button onClick={updateInfo} type="submit">
              Update
            </button>
            <button>Cancel</button>
          </div>
        </div>
      </div>
    )
  );
};

export default ProfileForm;

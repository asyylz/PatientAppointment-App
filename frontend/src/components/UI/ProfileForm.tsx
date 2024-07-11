import React, { useState } from 'react';
import classes from './ProfileForm.module.css';
import CustomInput from './CustomInput';
import { useSelector } from 'react-redux';
import { formatDateForInput } from '../../helper/generateDates';
import useHttp from './../../hooks/useHttp';

const ProfileForm: React.FC = () => {
  const { updateUserInfo } = useHttp();
  const { userData, status, image } = useSelector(
    (state: RootState) => state.currentUser
  );
  const [updatedUserData, setUpdatedUserData] = useState<object>({});

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
    updateUserInfo(updatedUserData);
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

          <div className={classes.buttonWrapper}>
            <button onClick={updateInfo} type="submit">
              Update
            </button>
            <button>Cancel</button>
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
          <CustomInput
            defaultValue="password"
            type="password"
            name="Password"
            placeHolder="Enter your password"
            onChange={handleInputChange}
          />
          <CustomInput
            type="password"
            name="Password"
            placeHolder="Confirm your new password"
            onChange={handleInputChange}
          />
          <CustomInput
            type="password"
            name="Password"
            placeHolder="Confirm your new password"
            onChange={handleInputChange}
          />
        </div>
      </div>
    )
  );
};

export default ProfileForm;

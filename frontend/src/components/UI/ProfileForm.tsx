import React, { useState } from 'react';
import classes from './ProfileForm.module.css';
import CustomInput from './CustomInput';
import { useSelector } from 'react-redux';
import { formatDateForInput } from '../../helper/generateDates';
import { updateUserInfo } from '../../store/currentUser-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import ImagePicker from './ImagePicker';

const ProfileForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userData, status, token } = useSelector(
    (state: RootState) => state.currentUser
  );
  const [updatedUserData, setUpdatedUserData] = useState<object>({});
  console.log(userData?.image);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === 'DOB') {
      const formattedDate = new Date(`${value}T00:00:00.000Z`);

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
    setUpdatedUserData({});
  };

  if (status === 'loading') <p>Loading...</p>;

  return (
    userData && (
      <div className={classes.container}>
        <div className={classes.wrapper}>
          <ImagePicker
            name="image"
            setUpdatedUserData={setUpdatedUserData}
            defaultImage={`http://localhost:3000/static/${userData?.image}`}
          />
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

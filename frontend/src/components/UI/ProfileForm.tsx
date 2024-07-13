import React, { useState } from 'react';
import classes from './ProfileForm.module.css';
import CustomInput from './CustomInput';
import { useSelector } from 'react-redux';
import { formatDateForInput } from '../../helper/generateDates';
import { updateUserInfo } from '../../store/currentUser-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import ImagePicker from './ImagePicker';
import MapAndAdressForm from './MapAndAdressForm';

const ProfileForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userData, status, token } = useSelector(
    (state: RootState) => state.currentUser
  );
  const [updatedUserData, setUpdatedUserData] = useState<UserData>({
    name: userData?.name,
    DOB: formatDateForInput(userData?.DOB),
    email: userData?.email,
    image: userData?.image,
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    // if (name === 'DOB') {
    //   const formattedDate = new Date(`${value}T00:00:00.000Z`);

    //   setUpdatedUserData((prevValues) => ({
    //     ...prevValues,
    //     DOB: formattedDate,
    //   }));
    // } else {
    //   setUpdatedUserData((prevValues) => ({
    //     ...prevValues,
    //     [name]: value,
    //   }));
    // }
    setUpdatedUserData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleClearInputs = () => {
    setUpdatedUserData({
      name: userData?.name,
      DOB: formatDateForInput(userData?.DOB),
      email: userData?.email,
      image: userData?.image,
    });
  };

  const updateInfo = () => {
    const userUpdatedFormData = new FormData();
    if (updatedUserData) {
      Object.entries(updatedUserData).forEach(([key, value]) => {
        userUpdatedFormData.append(key, value);
      });
    }

    dispatch(updateUserInfo({ userUpdatedFormData, token }));
    setUpdatedUserData({});
  };

  if (status === 'loading') <p>Loading...</p>;

  return (
    userData && (
      <>
        <p>User Info</p>
        <hr />
        <div
          //style={{border:'1px solid red'}}
          className={classes.container}
        >
          <ImagePicker
            name="image"
            setter={setUpdatedUserData}
            defaultImage={`http://localhost:3000/static${userData?.image}`}
          />

          <div className={classes.infoWrapper}>
            <CustomInput
              type="text"
              name="name"
              placeHolder="Enter your name"
              onChange={handleInputChange}
              value={updatedUserData?.name}
            />
            <CustomInput
              type="text"
              name="email"
              placeHolder="Enter your email"
              onChange={handleInputChange}
              value={updatedUserData?.email}
            />
            <CustomInput
              type="date"
              name="DOB"
              placeHolder="Enter your DOB"
              onChange={handleInputChange}
              value={updatedUserData?.DOB}
            />
          </div>
        </div>
        <br />
        <br />

        <div>
          <p>Adsress Settings</p>
          <hr />
          <div className={classes.container}>
            <MapAndAdressForm />
          </div>

          <div className={classes.buttonWrapper}>
            <button onClick={updateInfo} type="submit">
              Update
            </button>
            <button onClick={handleClearInputs}>Cancel</button>
          </div>
        </div>
      </>
    )
  );
};

export default ProfileForm;

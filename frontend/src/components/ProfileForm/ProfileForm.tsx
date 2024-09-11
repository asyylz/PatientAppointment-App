import React, { useState } from 'react';
import classes from './ProfileForm.module.css';
import CustomInput from '../CustomInput/CustomInput';
import { useSelector } from 'react-redux';
import { formatDateForInput } from '../../helper/generateDates';
import { updateUserInfo } from '../../store/currentUser-slice/currentUser-slice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/index';
import ImagePicker from '../ImagePicker/ImagePicker';
import MapAndAdressForm from '../MapAndAdressForm/MapAndAdressForm';

const ProfileForm: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { userData, status } = useSelector(
    (state: RootState) => state.currentUser
  );

  //this state uplifted here for MapAndAddressForm
  const [addressParts, setAddressParts] = useState<Address>({
    street: userData?.address?.street,
    city: userData?.address?.city,
    country: userData?.address?.country,
    town: userData?.address?.town,
    postalCode: userData?.address?.postalCode,
  });

  const [updatedUserData, setUpdatedUserData] = useState<UpdateUserData>({});

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setUpdatedUserData((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleCancelInputs = () => {
    setUpdatedUserData({
      name: userData?.name,
      DOB: formatDateForInput(userData?.DOB ?? ''),
      email: userData?.email,
      image: userData?.image,
      address: userData?.address,
    });
  };

  const updateInfo = () => {
    const userUpdatedFormData = new FormData();
    if (updatedUserData) {
      Object.entries(updatedUserData).forEach(([key, value]) => {
        // Stringify address object before appending
        if (key === 'address' && typeof value === 'object') {
          userUpdatedFormData.append(key, JSON.stringify(value));
        } else {
          userUpdatedFormData.append(key, value);
        }
      });
    }

    dispatch(updateUserInfo(userUpdatedFormData));
    setUpdatedUserData({});
  };

  if (status === 'loading') <p>Loading...</p>;

  return (
    userData && (
      <div className={classes['profil__container']}>
        <p>User Info</p>
        <hr />
        <div className={classes.container}>
          <ImagePicker
            name="image"
            setter={setUpdatedUserData}
            defaultImage={userData.image}
          />

          <div className={classes['wrapper__info--fields']}>
            <CustomInput
              defaultValue={userData.name}
              type="text"
              name="name"
              placeHolder="Enter your name"
              onChange={handleInputChange}
              value={updatedUserData?.name}
            />
            <CustomInput
              defaultValue={userData.email}
              type="text"
              name="email"
              placeHolder="Enter your email"
              onChange={handleInputChange}
              value={updatedUserData?.email}
            />
            <CustomInput
              defaultValue={formatDateForInput(userData?.DOB ?? '')}
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
          <div className={classes['wrapper__address']}>
            <MapAndAdressForm
              setAddressParts={setAddressParts}
              addressParts={addressParts}
              setUpdatedUserData={setUpdatedUserData}
            />
          </div>

          <div className={classes['wrapper__buttons']}>
            <button onClick={updateInfo} type="submit">
              Update
            </button>
            <button onClick={handleCancelInputs}>Cancel</button>
          </div>
        </div>
      </div>
    )
  );
};

export default ProfileForm;

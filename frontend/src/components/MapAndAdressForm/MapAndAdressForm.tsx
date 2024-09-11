import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CustomInput from '../CustomInput/CustomInput';
import classes from './MapAndAddress.module.css';
import { useSelector } from 'react-redux';
interface Location {
  lat: number;
  lng: number;
}

interface MapAndAdressFormProps {
  setAddressParts: (prevValues: any) => string | void;
  addressParts: Address;
  //setUpdatedUserData: (updatedUserData: UpdateUserData) => void;
  setUpdatedUserData: (prevValues: any) => string | void;
}

const MapAndAdressForm: React.FC<MapAndAdressFormProps> = ({
  setAddressParts,
  addressParts,
  setUpdatedUserData,
}) => {
  const { userData } = useSelector((state: RootState) => state.currentUser);

  const [address, setAddress] = useState<string>('');
  const [map, setMap] = useState<L.Map | null>(null);
  const [location, setLocation] = useState<Location>({
    lat: 0,
    lng: 0,
  });

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();
    return data.display_name;
  };

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ lat: latitude, lng: longitude });
            const addr = await reverseGeocode(latitude, longitude);
            setAddress(addr);
          },
          (error) => {
            console.error('Error getting location', error);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      }
    };

    getLocation();
  }, []);

  useEffect(() => {
    if (location.lat !== 0 && location.lng !== 0 && !map) {
      const initMap = L.map('map').setView([location.lat, location.lng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(initMap);

      L.marker([location.lat, location.lng])
        .addTo(initMap)
        .bindPopup('You are here!')
        .openPopup();

      setMap(initMap);
    }
  }, [location, map]);

  //console.log(addressParts);

  const handleAddressLoad = () => {
    const parts = address.split(',');
    setAddressParts({
      street: parts[0] || '',
      city: parts[4] || '',
      country: parts[8] || '',
      town: parts[3] || '',
      postalCode: parts[7] || '',
    });

    // Update userUpdatedData immediately after setting addressParts
    setUpdatedUserData((prevValues: UpdateUserData) => ({
      ...prevValues,
      address: {
        street: parts[0],
        city: parts[4],
        country: parts[8],
        town: parts[3],
        postalCode: parts[7],
      },
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    setAddressParts((prevValues: Address) => {
      const updatedAddressParts = {
        ...prevValues,
        [name]: value,
      };

      setUpdatedUserData((prevUserData: UpdateUserData) => ({
        ...prevUserData,
        address: updatedAddressParts,
      }));

      return updatedAddressParts;
    });
  };

  return (
    <>
      <div className={`${classes.wrapper} ${classes.address}`}>
        <CustomInput
          defaultValue={userData?.address?.street}
          placeHolder="Enter your street"
          type="text"
          name="street"
          value={addressParts?.street}
          onChange={handleInputChange}
          required
        />
        <CustomInput
          placeHolder="Enter your town"
          defaultValue={userData?.address?.town}
          type="text"
          name="town"
          value={addressParts?.town}
          onChange={handleInputChange}
          required
        />
        <CustomInput
          placeHolder="Enter your city"
          defaultValue={userData?.address?.city}
          type="text"
          name="city"
          value={addressParts?.city}
          onChange={handleInputChange}
          required
        />
        <CustomInput
          placeHolder="Enter your postcode"
          defaultValue={userData?.address?.postalCode}
          type="text"
          name="postalCode"
          onChange={handleInputChange}
          value={addressParts?.postalCode}
          required
        />
        <CustomInput
          placeHolder="Enter your country"
          defaultValue={userData?.address?.country}
          type="text"
          name="country"
          onChange={handleInputChange}
          value={addressParts?.country}
          required
        />

        <button onClick={handleAddressLoad}>Load Adress</button>
      </div>
      <div className={`${classes.wrapper} ${classes.map}`}>
        <div id="map" style={{ height: '300px', width: 'auto' }}></div>
        <p>Address: {address}</p>
      </div>
    </>
  );
};

export default MapAndAdressForm;

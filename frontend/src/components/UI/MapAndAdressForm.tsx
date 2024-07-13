import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CustomInput from './CustomInput';
import classes from './Map.module.css';
interface Location {
  lat: number;
  lng: number;
}

const MapAndAdressForm: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [map, setMap] = useState<L.Map | null>(null);
  const [location, setLocation] = useState<Location>({
    lat: 0,
    lng: 0,
  });

  console.log(address)
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

  const handleAddressLoad = () => {};

  return (
    <>
      <div className={classes.wrapper}>
        <CustomInput
          placeHolder="Enter your street"
          type="text"
          name="street"
          required
        />
        <CustomInput
          placeHolder="Enter your city"
          type="text"
          name="city"
          required
        />
        <CustomInput
          placeHolder="Enter your postcode"
          type="text"
          name="postcode"
          required
        />
        <CustomInput
          placeHolder="Enter your country"
          type="text"
          name="country"
          required
        />

        <button onClick={handleAddressLoad}>Load Adress</button>
      </div>
      <div>
        <div
          id="map"
          // className={classes.map}
          style={{ height: '400px', width: '500px' }}
        ></div>
        <div>Address: {address}</div>
      </div>
    </>
  );
};

export default MapAndAdressForm;

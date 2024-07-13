// AddressForm.tsx
import React, { useState } from 'react';
import { getAddressFromCoordinates } from './../../helper/GeoAPIService';

interface Address {
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

const AddressForm: React.FC = () => {
  const [lat, setLat] = useState<string>('');
  const [lon, setLon] = useState<string>('');
  const [address, setAddress] = useState<Address | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFetchAddress = async () => {
    try {
      const addressDetails = await getAddressFromCoordinates(
        parseFloat(lat),
        parseFloat(lon)
      );
      setAddress(addressDetails);
      setError(null);
    } catch (error) {
      setError('Failed to fetch address');
    }
  };

  return (
    <div>
      <h1>GeoAPI Address Locator</h1>
      <div>
        <label>
          Latitude:
          <input
            type="text"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Longitude:
          <input
            type="text"
            value={lon}
            onChange={(e) => setLon(e.target.value)}
          />
        </label>
      </div>
      <button onClick={handleFetchAddress}>Fetch Address</button>
      {error && <p>{error}</p>}
      {address && (
        <div>
          <h2>Address Details</h2>
          <p>Street: {address.street}</p>
          <p>City: {address.city}</p>
          <p>State: {address.state}</p>
          <p>Postcode: {address.postcode}</p>
          <p>Country: {address.country}</p>
        </div>
      )}
    </div>
  );
};

export default AddressForm;

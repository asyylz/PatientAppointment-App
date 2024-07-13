// GeoAPIService.ts
import axios from 'axios';

const GEO_API_URL =
  'https://api.openweathermap.org/data/2.5/?appid=${apiKey}';
const API_KEY = 'b8b2bc6cc3def4c8452b6812772a682f'; // Replace with your GeoAPI key

interface GeoAPIResponse {
  features: {
    properties: {
      formatted: string;
      street: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
  }[];
}

export const getAddressFromCoordinates = async (lat: number, lon: number) => {
  try {
    const response = await axios.get<GeoAPIResponse>(`${GEO_API_URL}`, {
      params: {
        lat,
        lon,
        apiKey: API_KEY,
      },
    });
    console.log(response.data.features[0].properties);
    return response.data.features[0].properties;
  } catch (error) {
    console.error('Error fetching address:', error);
    throw new Error('Failed to fetch address');
  }
};

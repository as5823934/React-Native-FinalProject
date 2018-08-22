import { Permissions, Location } from 'expo';
import Polyline from '@mapbox/polyline';

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c;
  return parseInt(d);
};

export const getLocationAsync = async () => {
  const { status } = await Permissions.askAsync(Permissions.LOCATION);
  if (status !== 'granted') {
    console.error('Location permission not granted!');
  }
  const location = await Location.getCurrentPositionAsync({});
  return location;
};

export const updateLocation = async () => {
  Location.watchPositionAsync(
    {
      enableHighAccuracy: true,
      distanceInterval: 10,
    },
    NewLocation => {
      const coords = NewLocation.coords;
      console.log('NEW LOCATION COORDS', coords);
      return coords;
    }
  );
};

export const getDirections = async (startLoc, destinationLoc) => {
  try {
    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`
    );
    console.log(resp);
    const respJson = await resp.json();
    console.log(respJson);
    const points = Polyline.decode(respJson.routes[0].overview_polyline.points);
    const coords = points.map((point, index) => ({
      latitude: point[0],
      longitude: point[1],
    }));
    console.log(('received route: ', coords));
    return coords;
  } catch (error) {
    return error;
  }
};

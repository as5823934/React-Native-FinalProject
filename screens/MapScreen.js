import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { Permissions, Location } from 'expo';
import MapView, { Marker } from 'react-native-maps';
import Polyline from '@mapbox/polyline';
import { Ionicons } from '@expo/vector-icons';
import haversine from 'haversine';

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;
export default class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: { latitude: 49.1913466, longitude: -122.8490125 },
      targetLocation: this.props.navigation.getParam('location', null),
      title: null,
      coords: [],
      curTime: new Date().toLocaleString(),
      distance: 0,
    };
  }

  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Ionicons
        name={`ios-map${focused ? '' : '-outline'}`}
        size={30}
        color={tintColor}
      />
    ),
  };

  getLocationAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      console.error('Location permission not granted!');
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    // check if have target location
    if (this.state.targetLocation) {
      const distance = this.calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        this.state.targetLocation.lat,
        this.state.targetLocation.lng
      );
      this.setState({
        distance,
        currentLocation: location.coords,
      });
      console.log('before distance: ', distance);
    }
    this.setState({
      currentLocation: location.coords,
    });

    console.log('current location loaded:', this.state.currentLocation);
  };

  componentDidMount() {
    // this.getLocationAsync();
    console.log('new target: ', this.state.targetLocation);
  }

  componentWillReceiveProps(nextProps) {
    const newTarget = nextProps.navigation.state.params.location;
    console.log('on props receive: ', newTarget);

    // this.setState({
    //   targetLocation: newTarget,
    // });
    // console.log('new target receive: ', this.state.targetLocation);

    if (
      newTarget !== this.state.targetLocation ||
      this.state.targetLocation === null
    ) {
      // this.getLocationAsync();
      const distance = this.calculateDistance(
        this.state.currentLocation.latitude,
        this.state.currentLocation.longitude,
        newTarget.lat,
        newTarget.lng
      );

      this.setState(
        { targetLocation: newTarget, distance },
        console.log('new target receive: ', this.state.targetLocation),
        console.log('aftre distance: ', this.state.distance)
      );
      const latitude = this.state.currentLocation.latitude;
      const longitude = this.state.currentLocation.longitude;
      this.getDirections(
        `${latitude},${longitude}`,
        `${newTarget.lat},${newTarget.lng}`
      );
    }
  }

  getMapRegion() {
    const { currentLocation, targetLocation } = this.state;
    if (!targetLocation) {
      const currentinfo = {
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      console.log('currentinfo: ', currentinfo);
      return currentinfo;
    }
    const targetinfo = {
      latitude: targetLocation.lat,
      longitude: targetLocation.lng,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    };
    return targetinfo;
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
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
  }

  getDirections = async (startLoc, destinationLoc) => {
    try {
      const resp = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}`
      );
      console.log(resp);
      const respJson = await resp.json();
      console.log(respJson);
      const points = Polyline.decode(
        respJson.routes[0].overview_polyline.points
      );
      const coords = points.map((point, index) => ({
        latitude: point[0],
        longitude: point[1],
      }));
      this.setState({ coords });
      console.log(coords);
      return coords;
    } catch (error) {
      return error;
    }
  };

  render() {
    if (!this.state.currentLocation) {
      return <View />;
    }
    if (this.state.targetLocation) {
      return (
        <View style={{ flex: 1 }}>
          <MapView style={{ flex: 1 }} initialRegion={this.getMapRegion()}>
            <MapView.Polyline
              coordinates={this.state.coords}
              strokeWidth={2}
              strokeColor="red"
            />
            <Marker
              title="You"
              coordinate={{
                latitude: this.state.currentLocation.latitude,
                longitude: this.state.currentLocation.longitude,
              }}
            />
            {this.state.targetLocation ? (
              <Marker
                title={'Target'}
                coordinate={{
                  latitude: this.state.targetLocation.lat,
                  longitude: this.state.targetLocation.lng,
                }}
                description={'Targeted location for check in'}
              />
            ) : null}
          </MapView>
          <View style={styles.container}>
            <Text>Distance: {this.state.distance} m</Text>
            <Text>Date: {this.state.curTime}</Text>
            <Text>Latitude: {this.state.currentLocation.latitude}</Text>
            <Text>Longitude: {this.state.currentLocation.longitude}</Text>
          </View>
        </View>
      );
    }
    return (
      <View style={{ flex: 1 }}>
        <MapView style={{ flex: 1 }} initialRegion={this.getMapRegion()}>
          <Marker
            title="You"
            coordinate={{
              latitude: this.state.currentLocation.latitude,
              longitude: this.state.currentLocation.longitude,
            }}
          />
        </MapView>
        <View style={styles.container}>
          <Text>Distance: {this.state.distance} m</Text>
          <Text>Date: {this.state.curTime}</Text>
          <Text>Latitude: {this.state.currentLocation.latitude}</Text>
          <Text>Longitude: {this.state.currentLocation.longitude}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0.2,
    backgroundColor: '#ff00ff20',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

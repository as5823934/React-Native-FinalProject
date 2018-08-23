import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { calculateDistance, getLocationAsync, getDirections } from '../unity';

const LATITUDE_DELTA = 0.0922 / 1.5;
const LONGITUDE_DELTA = 0.0421 / 1.5;
const LATITUDE = 49.1913466;
const LONGITUDE = -122.8490125;

export default class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: this.props.navigation.getParam('currentLocation', null),
      targetLocation: this.props.navigation.getParam('targetLocation', null),
      title: null,
      coords: this.props.navigation.getParam('route', null),
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

  componentDidMount() {
    this.getCurrentLocation();
  }

  getCurrentLocation = async () => {
    const location = await getLocationAsync();
    // check if have target location
    if (this.state.targetLocation) {
      const distance = calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        this.state.targetLocation.lat,
        this.state.targetLocation.lng
      );
      this.setState({
        distance,
        currentLocation: location.coords,
      });

      this.getRoute(
        `${this.state.currentLocation.latitude},${
          this.state.currentLocation.longitude
        }`,
        `${this.state.targetLocation.lat},${this.state.targetLocation.lng}`
      );
      console.log('before distance: ', distance);
    }

    this.setState({
      currentLocation: location.coords,
    });
    console.log('current location loaded:', this.state.currentLocation);
  };

  componentWillReceiveProps(nextProps) {
    // const newTarget = nextProps.navigation.getParam('location');
    const newTarget = nextProps.screenProps.targetLocation;
    console.log('on props receive: ', newTarget);

    const distance = calculateDistance(
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
    const current = this.state.currentLocation;
    this.getRoute(
      `${current.latitude},${current.longitude}`,
      `${newTarget.lat},${newTarget.lng}`
    );
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

  getRoute = async (lat, lng) => {
    const coords = await getDirections(lat, lng);
    this.setState({ coords });
  };

  render() {
    if (!this.state.currentLocation) {
      return <View />;
    }
    if (this.props.screenProps.targetLocation) {
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
            {this.props.screenProps.targetLocation ? (
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
        <MapView style={{ flex: 2 }} initialRegion={this.getMapRegion()}>
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
    flex: 0.3,
    backgroundColor: '#ff00ff20',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

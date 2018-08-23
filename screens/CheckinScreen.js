import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase';
import { getUserInfo, updateCurrentLocation, checkIn } from '../config_auth';
import { calculateDistance, getLocationAsync } from '../unity';

export default class CheckinScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: null,
      targetLocation: this.props.screenProps.targetLocation,
      id: this.props.navigation.getParam('UID'),
      userInfo: null,
      distance: 0,
    };
  }

  static navigationOptions = ({ navigation }) => ({
    tabBarIcon: ({ focused, tintColor }) => (
      <Ionicons
        name={`md-checkmark-circle${focused ? '' : '-outline'}`}
        size={30}
        color={tintColor}
      />
    ),
  });

  componentDidMount() {
    this.getCurrentLocation();
    if (this.props.screenProps.targetLocation) {
      this.setState({ IsCheckable: !this.state.IsCheckable });
    }
    console.log('screenProps:', this.props.screenProps.targetLocation);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.screenProps.targetLocation) {
      const distance = calculateDistance(
        this.state.currentLocation.latitude,
        this.state.currentLocation.longitude,
        nextProps.screenProps.targetLocation.lat,
        nextProps.screenProps.targetLocation.lng
      );
      this.setState({
        targetLocation: nextProps.screenProps.targetLocation,
        distance,
      });
    }
  }

  getCurrentLocation = async () => {
    const location = await getLocationAsync();
    this.setState({ currentLocation: location.coords });
    updateCurrentLocation(this.state.currentLocation);
    this.props.screenProps.setCurrentLocation(this.state.currentLocation);
  };

  testPress = async () => {
    const target = this.props.screenProps.targetLocation;
    const title = this.props.screenProps.targetTitle;
    const location = await getLocationAsync();
    this.setState({ currentLocation: location.coords });
    this.props.screenProps.setCurrentLocation(this.state.currentLocation);

    const distance = calculateDistance(
      this.state.currentLocation.latitude,
      this.state.currentLocation.longitude,
      target.lat,
      target.lng
    );
    this.setState({ distance });
    console.log(distance);
    console.log('screenProps:', title, target);

    if (distance > 100172) {
      alert('You can not check in');
    } else {
      checkIn(target, title);
      this.props.screenProps.validateCheckInButton();
      alert('Check in success');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.testPress()}
          disabled={!this.props.screenProps.isCheckInable}>
          <Ionicons
            name="md-checkmark-circle"
            size={150}
            color={!this.props.screenProps.isCheckInable ? 'gray' : 'green'}
          />
        </TouchableOpacity>
        <Text>Checkin</Text>
        <Text>Destination: {this.props.screenProps.targetTitle}</Text>
        <Text>Distance: {this.props.screenProps.distance}m</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

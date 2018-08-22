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
      currentLocation: { latitude: 49.28595240000001, longitude: -123.1115642 },
      targetLocation: null,
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

  // componentWillReceiveProps(nextProps) {
  //   const newTarget = nextProps.navigation.state.params.tar;
  //   console.log(newTarget);
  // }

  componentWillMount() {
    // this.getCurrentLocation();
    // updateCurrentLocation(location.coords);
    // console.log('current location: ', this.state.currentLocation.coords);
    this.loadUserInfo();
    console.log('screenProps:', this.props.screenProps.targetLocation);
  }

  getCurrentLocation = async () => {
    const location = await getLocationAsync();
    this.setState({ currentLocation: location.coords });
  };

  loadUserInfo = async () => {
    const id = this.props.navigation.getParam('UID');
    const ref = await getUserInfo(id);
    this.setState({ userInfo: ref });
    console.log('userinfo loaded: ', this.state.userInfo);
  };

  testPress = async () => {
    const target = this.props.screenProps.targetLocation;
    const title = this.props.screenProps.targetTitle;
    const location = await this.getCurrentLocation();
    this.setState({ currentLocation: location.coords });
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
      alert('Check in success');
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.testPress()}>
          <Ionicons name="md-checkmark-circle" size={150} color="green" />
        </TouchableOpacity>
        <Text>CheckinScreen</Text>
        <Text>///</Text>
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

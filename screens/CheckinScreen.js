import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MapView, Permissions, Location } from 'expo';
import firebase from 'firebase';
import { getUserInfo, updateCurrentLocation } from '../config_auth';
import { calculateDistance, getLocationAsync, getDirections } from '../unity';

export default class CheckinScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: null,
      id: this.props.navigation.getParam('UID'),
      userInfo: null,
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

  componentWillMount() {
    this.getCurrentLocation();
  }

  getCurrentLocation = async () => {
    const location = await getLocationAsync();
    this.setState({ currentLocation: location });
    updateCurrentLocation(location.coords);
    console.log('current location: ', this.state.currentLocation.coords);
    this.loadUserInfo();
  };

  loadUserInfo = async () => {
    const id = this.props.navigation.getParam('UID');
    const ref = await getUserInfo(id);
    this.setState({
      userInfo: ref,
    });
    console.log('userinfo loaded: ', this.state.userInfo);
  };

  testPress = async () => {
    const id = this.props.navigation.getParam('UID');
    const ref = await getUserInfo(id);
    // const data = await ref.json();

    console.log(ref);
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.testPress()}>
          <Ionicons name="md-checkmark-circle" size={150} color="green" />
        </TouchableOpacity>
        <Text>CheckinScreen</Text>
        <Text>{this.props.navigation.getParam('UID')}</Text>
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

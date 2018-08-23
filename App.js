import React from 'react';
import { TouchableOpacity } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createDrawerNavigator,
} from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';
import MapScreen from './screens/MapScreen';
import CheckInScreen from './screens/CheckinScreen';
import CheckOutScreen from './screens/CheckoutScreen';
import SearchingScreen from './screens/SearchingScreen';
import LoginScreen from './screens/LoginScreen';
import InfoScreen from './screens/InfoScreen';
import { initAuthApp } from './config_auth';
import PortfolioScreen from './screens/PortfolioScreen';

const MainTabs = createBottomTabNavigator({
  CheckIn: CheckInScreen,
  Map: MapScreen,
  CheckOut: CheckOutScreen,
});

MainTabs.navigationOptions = ({ navigation }) => {
  const { routes, index } = navigation.state;
  const navigationOptions = {
    headerRight: (
      <TouchableOpacity
        style={{ paddingRight: 10 }}
        onPress={() => navigation.navigate('Search')}>
        <Ionicons name="ios-search" size={40} />
      </TouchableOpacity>
    ),
    headerLeft: (
      <TouchableOpacity
        style={{ paddingLeft: 10 }}
        onPress={() => navigation.navigate('Portfolio')}>
        <Ionicons name="ios-contact" size={40} />
      </TouchableOpacity>
    ),
  };
  if (routes[index].routeName === 'CheckIn') {
    navigationOptions.title = 'Check In';
  }
  if (routes[index].routeName === 'Map') {
    navigationOptions.title = 'Map';
  }
  if (routes[index].routeName === 'CheckOut') {
    navigationOptions.title = 'Check Out';
  }
  return navigationOptions;
};

const MainStack = createStackNavigator(
  {
    MyTabs: MainTabs,
    Search: SearchingScreen,
    Portfolio: PortfolioScreen,
  },
  {
    initialRouteName: 'MyTabs',
  }
);

const AppNavigator = createSwitchNavigator(
  {
    Login: LoginScreen,
    Info: InfoScreen,
    OnCheckIn: MainStack,
  },
  {
    initialRouteName: 'Login',
  }
);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentLocation: null,
      targetLocation: null,
      targetTitle: 'Please select a location',
      distance: 0,
      isCheckInable: false,
      isCheckOutable: false,
      coords: [],
      isEditPortfolio: false,
    };
  }

  componentDidMount() {
    // life cycle method
    initAuthApp();
  }

  validateCheckInButton = () => {
    this.setState({
      isCheckInable: !this.state.isCheckInable,
      isCheckOutable: true,
      targetLocation: null,
      distance: 0,
      coords: null,
      targetTitle: 'Please select a location',
    });
  };

  validateCheckOutButton = () => {
    this.setState({
      isCheckInable: false,
      isCheckOutable: !this.state.isCheckOutable,
    });
  };

  setCurrentLocation = location => {
    this.setState({ currentLocation: location });
  };

  setTargetLocation = (location, title, distance, coords) => {
    this.setState({
      targetLocation: location,
      targetTitle: title,
      isCheckInable: true,
      distance,
      coords,
    });
  };

  setDistance = distance => {
    // const distance = calculateDistance(
    //   this.state.currentLocation.latitude,
    //   this.state.currentLocation.longitude,
    //   newTarget.lat,
    //   newTarget.lng
    // );
    this.setState({
      distance: this.state.distance,
    });
  };

  render() {
    return (
      <AppNavigator
        screenProps={{
          setCurrentLocation: this.setCurrentLocation,
          submitTargetLocation: this.setTargetLocation,
          currentLocation: this.state.currentLocation,
          targetLocation: this.state.targetLocation,
          targetTitle: this.state.targetTitle,
          validateCheckInButton: this.validateCheckInButton,
          validateCheckOutButton: this.validateCheckOutButton,
          isCheckInable: this.state.isCheckInable,
          isCheckOutable: this.state.isCheckOutable,
          setDistance: this.setDistance,
          distance: this.state.distance,
          coords: this.state.coords,
        }}
      />
    );
  }
}

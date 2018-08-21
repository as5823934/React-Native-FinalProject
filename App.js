import React from 'react';
import { Button, TouchableOpacity, Text } from 'react-native';
import { MapView, Permissions, Location } from 'expo';
import firebase from 'firebase';
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
import { initAuthApp } from './auth';
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
    this.state = {};
  }

  componentDidMount() {
    // life cycle method
    initAuthApp();
  }

  render() {
    return <AppNavigator />;
  }
}

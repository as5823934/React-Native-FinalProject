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
      targetTitle: null,
      coords: [],
      curTime: new Date().toLocaleString(),
      distance: 0,
    };
  }

  componentDidMount() {
    // life cycle method
    initAuthApp();
  }

  setTargetLocation = (location, title) => {
    this.setState({
      targetLocation: location,
      targetTitle: title,
    });
  };

  render() {
    return (
      <AppNavigator
        screenProps={{
          submitTargetLocation: this.setTargetLocation,
          targetLocation: this.state.targetLocation,
          targetTitle: this.state.targetTitle,
        }}
      />
    );
  }
}

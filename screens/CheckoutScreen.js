import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { checkOut } from '../config_auth';

export default class CheckoutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => (
      <Ionicons
        name={`ios-exit${focused ? '' : '-outline'}`}
        size={30}
        color={tintColor}
      />
    ),
  };

  handleCheckout = () => {
    const target = this.props.screenProps.targetLocation;
    const title = this.props.screenProps.targetTitle;
    checkOut(target, title);
    this.props.screenProps.validateCheckOutButton();
    alert('You have checked out');
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.handleCheckout()}
          disabled={!this.props.screenProps.isCheckOutable}>
          <MaterialCommunityIcons
            name="logout"
            size={150}
            color={!this.props.screenProps.isCheckOutable ? 'gray' : 'green'}
          />
        </TouchableOpacity>
        <Text>Check Out</Text>
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

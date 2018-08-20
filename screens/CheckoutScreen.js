import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";


export default class CheckoutScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
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


    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity>
                    <MaterialCommunityIcons
                        name="logout"
                        size={150}
                        color='green'
                    />
                </TouchableOpacity>
                <Text>CheckoutScreen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

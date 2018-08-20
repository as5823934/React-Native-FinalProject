import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";



export default class SettingScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    static navigationOptions = ({ navigation }) => ({
        title: 'Settings',
        headerRight: (
            <TouchableOpacity
                style={{ paddingRight: 10 }}
            >
                <Ionicons
                    name='ios-add'
                    size={40}
                />
            </TouchableOpacity>
        ),
        headerBackTitle: null,
    });

    render() {
        return (
            <View style={styles.container}>
                <Text>SettingScreen</Text>
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

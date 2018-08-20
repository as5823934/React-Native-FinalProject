import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { MapView, Permissions, Location } from "expo";
import { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";


export default class MapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            location: null,
            title: null
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


    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== "granted") {
            console.error("Location permission not granted!");
            return;
        }
        let location = await Location.getCurrentPositionAsync({});
        this.setState({ location });
        console.log(this.state.location);
    };

    componentDidMount() {
        this._getLocationAsync();
    }

    render() {
        if (!this.state.location) {
            return <View />;
        }
        return (
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: this.state.location.coords.latitude,
                    longitude: this.state.location.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }}
            >
                <Marker
                    title="Home"
                    coordinate={this.state.location.coords}
                />
            </MapView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center"
    }
});
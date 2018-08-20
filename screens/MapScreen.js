import React from 'react';
import { StyleSheet, Text, View, Platform } from "react-native";
import { MapView, Permissions, Location } from "expo";
import { Marker, AnimatedRegion, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import haversine from "haversine";

const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = 0.0421;
export default class MapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            location: null,
            title: null,
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

    // calcDistance = newLatLng => {
    //     const { prevLatLng } = this.state;
    //     return haversine(prevLatLng, newLatLng) || 0;
    // };

    getMapRegion = () => ({
        latitude: this.state.location.coords.latitude,
        longitude: this.state.location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
    });

    render() {
        if (!this.state.location) {
            return <View />;
        }
        return (
            <MapView
                style={{ flex: 1 }}
                initialRegion={
                    this.getMapRegion()
                }
            >
                <Marker
                    title="You"
                    coordinate={this.state.location.coords}
                />

                <Marker
                    coordinate={{
                        latitude: 49.285087,
                        longitude: -123.112974,
                    }}
                    title={'Target'}
                    description={'Targeted location for check in'}
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
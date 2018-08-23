import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import { addLocationToData, GOOGLE_API_KEY } from '../config_auth';
import { calculateDistance } from '../unity';

// const homePlace = {
//   description: 'Home',
//   geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
// };
// const workPlace = {
//   description: 'Work',
//   geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
// };

export default class SearchingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetLocation: null,
      title: null,
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Searching',
    headerRight: (
      <TouchableOpacity
        style={{ paddingRight: 10 }}
        onPress={() => navigation.state.params.add()}>
        <Ionicons name="ios-add" size={40} />
      </TouchableOpacity>
    ),
  });

  componentDidMount() {
    this.props.navigation.setParams({ add: this.addInfoToFirebase });
  }

  addInfoToFirebase = async () => {
    const { location, title } = this.state;
    if (location === null || title === null) {
      return;
    }
    addLocationToData(location, title);
  };

  GooglePlacesInput = () => (
    <GooglePlacesAutocomplete
      placeholder="Search"
      minLength={2} // minimum length of text to search
      autoFocus={false}
      returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
      listViewDisplayed="auto" // true/false/undefined
      fetchDetails={true}
      renderDescription={row => row.description} // custom description render
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        this.setState({
          targetLocation: details.geometry.location,
          title: data.structured_formatting.main_text,
        });

        const currentLocation = this.props.screenProps.currentLocation;

        const distance = calculateDistance(
          currentLocation.latitude,
          currentLocation.longitude,
          this.state.targetLocation.lat,
          this.state.targetLocation.lng
        );
        // this.addInfoToFirebase(this.state.location, this.state.title);
        this.props.screenProps.submitTargetLocation(
          this.state.targetLocation,
          this.state.title,
          distance
        );
        this.props.screenProps.setDistance(distance);

        this.props.navigation.navigate('Map', {
          currentLocation,
          targetLocation: this.state.targetLocation,
          distance,
        });
      }}
      getDefaultValue={() => ''}
      query={{
        options:
          'https://developers.google.com/places/web-service/autocomplete',
        key: GOOGLE_API_KEY,
        language: 'en', // language of the results
        // types: '(cities)', // default: 'geocode'
      }}
      styles={{
        textInputContainer: {
          width: '100%',
        },
        description: {
          fontWeight: 'bold',
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
        },
      }}
      // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      // currentLocationLabel="Current location"
      nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      GoogleReverseGeocodingQuery={{
        API: 'https://developers.google.com/maps/documentation/geocoding/intro',
      }}
      GooglePlacesSearchQuery={{
        API: 'https://developers.google.com/places/web-service/search',
        rankby: 'distance',
        types: 'food',
      }}
      filterReverseGeocodingByTypes={[
        'locality',
        'administrative_area_level_3',
      ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      // predefinedPlaces={[homePlace, workPlace]}
      debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      renderLeftButton={() => null}
      renderRightButton={() => null}
    />
  );

  render() {
    return <View style={styles.container}>{this.GooglePlacesInput()}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

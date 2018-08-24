import React from 'react';
import { StyleSheet, View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {
  addLocationToData,
  GOOGLE_API_KEY,
  getLocationBookData,
} from '../config_auth';
import { calculateDistance } from '../unity';

export default class SearchingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { locationBook: [] };
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Searching',
  });

  async componentWillMount() {
    const result = await getLocationBookData();
    this.setState({ locationBook: result });
  }

  handleChoose = (data, details) => {
    const targetLocation = details.geometry.location;
    const title = data.description;

    console.log(details.geometry.location, data.description);

    const currentLocation = this.props.screenProps.currentLocation;

    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      targetLocation.lat,
      targetLocation.lng
    );

    this.props.screenProps.submitTargetLocation(
      targetLocation,
      title,
      distance
    );
    addLocationToData(targetLocation, title);
    this.props.screenProps.setDistance(distance);

    this.props.navigation.navigate('Map', {
      currentLocation,
      targetLocation,
      distance,
    });
  };

  GooglePlacesInput = () => (
    <GooglePlacesAutocomplete
      placeholder="Search"
      minLength={2}
      autoFocus={
        false // minimum length of text to search
      }
      returnKeyType={'search'}
      listViewDisplayed="auto"
      fetchDetails={
        true // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype // true/false/undefined
      }
      renderDescription={row => row.description}
      onPress={(data, details = null) => {
        // custom description render
        // 'details' is provided when fetchDetails = true

        this.handleChoose(data, details);
      }}
      getDefaultValue={() => ''}
      query={
        {
          options:
            'https://developers.google.com/places/web-service/autocomplete',
          key: GOOGLE_API_KEY,
          language: 'en',
        } // language of the results
        // types: '(cities)', // default: 'geocode'
      }
      styles={{
        textInputContainer: { width: '100%' },
        description: { fontWeight: 'bold' },
        predefinedPlacesDescription: { color: '#1faadb' },
      }} // currentLocationLabel="Current location" // currentLocation={true} // Will add a 'Current location' button at the top of the predefined places list
      nearbyPlacesAPI="GooglePlacesSearch"
      GoogleReverseGeocodingQuery={
        {
          API:
            'https://developers.google.com/maps/documentation/geocoding/intro',
        } // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
      }
      GooglePlacesSearchQuery={{
        API: 'https://developers.google.com/places/web-service/search',
        rankby: 'distance',
        types: 'food',
      }}
      filterReverseGeocodingByTypes={[
        'locality',
        'administrative_area_level_3',
      ]}
      predefinedPlaces={
        this.state.locationBook // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
      }
      debounce={200}
      renderLeftButton={
        () => null // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      }
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

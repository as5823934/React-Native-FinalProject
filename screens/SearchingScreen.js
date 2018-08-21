import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase';
import { GOOGLE_API_KEY } from '../auth';

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
      location: null,
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
    const user = await firebase.auth().currentUser;
    const locationBook = {
      location,
      title,
    };
    await firebase
      .database()
      .ref('users/')
      .child(user.uid)
      .update({
        locationBook,
      })
      .then(data => {
        // success callback
        alert(`Location saved: ${title}`);
        console.log('data added');
      })
      .catch(error => {
        // error callback
        alert('Something went wrong...');
        console.log('error ', error);
      });
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
        console.log('Data!!!', data);
        console.log('Details!!!', details);
        this.setState({
          location: details.geometry.location,
          title: data.structured_formatting.main_text,
        });
        this.props.navigation.navigate('Map', {
          location: this.state.location,
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

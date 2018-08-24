import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import firebase from 'firebase';

export default class InfoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: null,
      email: this.props.navigation.getParam('Email'),
      name: '',
      phone: '',
      thumbnailURL: null,
      errMessage: null,
      loading: false,
      isFormValid: false,
    };
  }

  writeUserData = async () => {
    const user = await firebase.auth().currentUser;
    const { email, name, phone, thumbnailURL } = this.state;
    await firebase
      .database()
      .ref('users/')
      .child(user.uid)
      .child('userInfo')
      .set({ email, name, phone, thumbnailURL })
      .then(data => {
        // success callback
        this.setState({ loading: true });
        this.props.navigation.navigate('CheckIn', { UID: user.uid });
        console.log('data ', data);
      })
      .catch(error => {
        // error callback
        this.setState({ errMessage: 'Something went wrong..' });
        console.log('error ', error);
      });
  };

  onSubmit = () => {
    this.writeUserData();
  };

  validateForm = () => {
    const { name, phone } = this.state;
    if (name !== '' && (phone >= 0 && phone.length === 9)) {
      this.setState({ isFormValid: true, errMessage: null });
    } else {
      this.setState({
        isFormValid: false,
      });
    }
    console.log(this.state.isFormValid);
  };

  onSuccess = () => {
    this.setState(
      {
        name: '',
        phone: '',
        loading: false,
        errMessage: null,
      },
      () => this.props.navigation.navigate('CheckIn')
    );
  };

  handleNameChange = name => {
    this.setState({ name });
    this.validateForm();
  };

  handlePhoneChange = phone => {
    this.setState({ phone });
    this.validateForm();
  };

  renderSubmitButton = () => {
    if (this.state.loading) {
      return (
        <View style={{ marginVertical: 20, marginHorizontal: 30 }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return (
      <View style={{ marginVertical: 20, marginHorizontal: 30 }}>
        <Button
          title="Register"
          color="lightgray"
          onPress={this.onSubmit}
          disabled={!this.state.isFormValid}
        />
      </View>
    );
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: -500 })}
        enabled
        style={styles.container}>
        <ScrollView>
          <View style={{ paddingVertical: 30 }}>
            <Text
              style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>
              Welcome
            </Text>
          </View>
          <View>
            <Text style={styles.text}>Please enter following info</Text>
            <Text style={{ color: 'red' }}>{this.state.errMessage}</Text>
            <TextInput
              style={[
                styles.input,
                { borderColor: `${!this.state.editable ? 'gray' : 'blue'}` },
              ]}
              placeholder="Email"
              value={this.state.email}
              underlineColorAndroid={'transparent'}
              multiline={false}
              editable={false}
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: `${!this.state.editable ? 'gray' : 'blue'}` },
              ]}
              placeholder="Name"
              onChangeText={this.handleNameChange}
              value={this.state.name}
              underlineColorAndroid={'transparent'}
              multiline={false}
            />
            <TextInput
              style={[
                styles.input,
                { borderColor: `${!this.state.editable ? 'gray' : 'blue'}` },
              ]}
              placeholder="Phone#"
              onChangeText={this.handlePhoneChange}
              value={this.state.phone}
              underlineColorAndroid={'transparent'}
              multiline={false}
            />
          </View>
          {this.renderSubmitButton()}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  input: {
    borderStartWidth: 1.5,
    borderEndWidth: 1.5,
    borderWidth: 0.3,
    minWidth: 100,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
});

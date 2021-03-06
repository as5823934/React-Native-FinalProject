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
import { SimpleLineIcons } from '@expo/vector-icons';
import firebase from 'firebase';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: null,
      email: '',
      password: '',
      errMessage: null,
      loading: false,
      isFormValid: false,
    };
  }

  isEmailValid = email => {
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email) != 0;
  };

  onLogin = () => {
    const { email, password } = this.state;
    this.setState({ loading: true });
    try {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        // if success
        .then(this.onSuccess)
        .catch(() => {
          // if not found-> create
          firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(this.onCreateSuccess) // if success
            .catch(this.onFail); // if fail
        });
    } catch (error) {
      console.log(error);
    }
  };

  validateForm = () => {
    if (
      +this.state.password >= 0 && // +"123" => 123 convert string type to num
      this.state.password.length > 4 &&
      this.isEmailValid(this.state.email)
    ) {
      this.setState({ isFormValid: true });
    } else {
      this.setState({ isFormValid: false });
    }
  };

  onSuccess = async () => {
    const user = await firebase.auth().currentUser;
    this.setState(
      {
        password: '',
        loading: false,
        errMessage: '',
      },
      () =>
        this.props.navigation.navigate('CheckIn', {
          Email: this.state.email,
          UID: user.uid,
        })
    );
    console.log('logged in');
  };

  onCreateSuccess = async () => {
    this.setState(
      {
        password: '',
        loading: false,
        errMessage: null,
      },
      () => this.props.navigation.navigate('Info', { Email: this.state.email })
    );
    console.log('create profile');
  };

  onFail = () => {
    const { email, password } = this.state;

    this.setState({
      errMessage: 'Authentication fail.',
      loading: false,
    });
  };

  onRegister = () => {
    this.props.navigation.navigate('Info');
  };

  handleEmailChange = email => {
    this.setState({ email });
    this.validateForm();
  };

  handlePasswordChange = password => {
    this.setState({ password });
    this.validateForm();
  };

  renderLoginButton = () => {
    if (this.state.loading) {
      return (
        <View
          style={{
            marginVertical: 20,
            marginHorizontal: 30,
          }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    return (
      <View
        style={{
          marginVertical: 20,
          marginHorizontal: 30,
          backgroundColor: `${!this.state.isFormValid ? 'gray' : 'blue'}`,
        }}>
        <Button
          title="Login"
          color="lightgray"
          onPress={this.onLogin}
          disabled={!this.state.isFormValid}
        />
      </View>
    );
  };

  render() {
    return (
      <KeyboardAvoidingView
        style={[
          styles.container,
          { paddingTop: Platform.OS === 'ios' ? 50 : 20 },
        ]}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        keyboardVerticalOffset={Platform.select({ ios: 70, android: -500 })}>
        <View
          style={{
            paddingVertical: 50,
            alignItems: 'center',
          }}>
          <SimpleLineIcons
            name="note"
            size={130}
            style={{ marginBottom: 40 }}
          />
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Attendants
          </Text>
        </View>
        <View>
          <Text style={styles.text}>{this.state.errMessage} </Text>
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            autoCapitalize="none"
            onChangeText={this.handleEmailChange}
            value={this.state.email}
            underlineColorAndroid={'transparent'}
            multiline={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={this.handlePasswordChange}
            value={this.state.phone}
            underlineColorAndroid={'transparent'}
            multiline={false}
          />
        </View>
        {this.renderLoginButton()}
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
    textAlign: 'center',
    color: 'red',
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

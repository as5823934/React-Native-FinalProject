import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import firebase from 'firebase';

export default class InfoScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: null,
      email: this.props.navigation.getParam('Email'),
      name: '',
      course: '',
      instructor: '',
      errMessage: null,
      loading: false,
      isFormValid: false,
    };
  }

  writeUserData = async () => {
    const user = await firebase.auth().currentUser;
    const { email, name, course, instructor } = this.state;
    await firebase
      .database()
      .ref('users/')
      .child(user.uid)
      .set({
        email,
        name,
        course,
        instructor,
      })
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
    const { name, course, instructor } = this.state;
    if (name == '' || course == '' || instructor == '') {
      this.setState({
        isFormValid: false,
      });
    } else {
      this.setState({
        isFormValid: true,
        errMessage: null,
      });
    }
    console.log(this.state.isFormValid);
  };

  onSuccess = () => {
    this.setState(
      {
        name: '',
        course: '',
        instructor: '',
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

  handleCourseChange = course => {
    this.setState({ course });
    this.validateForm();
  };

  handleInstructorChange = instructor => {
    this.setState({ instructor });
    this.validateForm();
  };

  renderLoginButton = () => {
        if (this.state.loading) {
            return (
                <View style={{ marginVertical: 20, marginHorizontal: 30 }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        } 
            return (
                <View style={{ marginVertical: 20, marginHorizontal: 30 }}>
                    <Button title="Register" onPress={this.onSubmit} disabled={!this.state.isFormValid} />
                </View>
            );
        
    }


  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
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
            style={styles.input}
            placeholder="Email"
            value={this.state.email}
            underlineColorAndroid={'transparent'}
            multiline={false}
            editable={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={this.handleNameChange}
            value={this.state.name}
            underlineColorAndroid={'transparent'}
            multiline={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Course"
            onChangeText={this.handleCourseChange}
            value={this.state.course}
            underlineColorAndroid={'transparent'}
            multiline={false}
          />
          <TextInput
            style={styles.input}
            placeholder="Instructor"
            onChangeText={this.handleInstructorChange}
            value={this.state.instructor}
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
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    minWidth: 100,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
});

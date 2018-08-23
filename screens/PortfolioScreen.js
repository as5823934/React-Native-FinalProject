import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { getUserInfo, updateUserInfo } from '../config_auth';

export default class PortfolioScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editable: false,
      name: '',
      phone: '',
      school: '',
      major: '',
      instructor: '',
    };
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Protfolio',
    headerRight: (
      <TouchableOpacity
        style={
          { paddingRight: 10 } // <Button title='EDIT' onPress={()=> this.toogleEdit()}/>
        }
        onPress={() => navigation.state.params.edit()}>
        <Entypo name="edit" size={30} />
      </TouchableOpacity>
    ),
  });

  componentWillMount() {
    this.loadUserInfo();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      edit: this.toogleEdit,
    });
  }

  loadUserInfo = async () => {
    const ref = await getUserInfo();
    this.setState({
      name: ref.userInfo.name || '',
      phone: ref.userInfo.phone || '',
      school: ref.userInfo.school || '',
      major: ref.userInfo.major || '',
      instructor: ref.userInfo.instructor || '',
    });
    console.log('userinfo loaded: ', ref.userInfo);
  };

  toogleEdit = () => {
    this.setState({
      editable: !this.state.editable,
    });
    this.props.screenProps.enableEditPortfolio();
  };

  update = () => {
    const { name, phone, school, major, instructor } = this.state;
    this.setState({ editable: false });
    updateUserInfo(name, phone, school, major, instructor);
    alert('Information updated');
  };

  handleNameChange = name => {
    this.setState({ name });
  };

  handlePhoneChange = phone => {
    this.setState({ phone });
  };

  handleSchoolChange = school => {
    this.setState({ school });
  };

  handleMajorChange = major => {
    this.setState({ major });
  };

  handleInstructorChange = instructor => {
    this.setState({ instructor });
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
          title="Submit"
          onPress={this.update}
          disabled={!this.state.editable}
        />
      </View>
    );
  };

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <View style={{ paddingVertical: 30 }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              textAlign: 'center',
            }}>
            Profile:
          </Text>
        </View>
        <View>
          <Text style={{ color: 'red' }}>{this.state.errMessage}</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            onChangeText={this.handleNameChange}
            value={this.state.name}
            underlineColorAndroid={'transparent'}
            multiline={false}
            editable={this.state.editable}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            onChangeText={this.handlePhoneChange}
            value={this.state.phone}
            underlineColorAndroid={'transparent'}
            multiline={false}
            editable={this.state.editable}
          />
          <TextInput
            style={styles.input}
            placeholder="School"
            onChangeText={this.handleSchoolChange}
            value={this.state.school}
            underlineColorAndroid={'transparent'}
            multiline={false}
            editable={this.state.editable}
          />
          <TextInput
            style={styles.input}
            placeholder="Major"
            onChangeText={this.handleMajorChange}
            value={this.state.major}
            underlineColorAndroid={'transparent'}
            multiline={false}
            editable={this.state.editable}
          />
          <TextInput
            style={styles.input}
            placeholder="Instructor"
            onChangeText={this.handleInstructorChange}
            value={this.state.instructor}
            underlineColorAndroid={'transparent'}
            multiline={false}
            editable={this.state.editable}
          />
        </View>
        {this.renderSubmitButton()}
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

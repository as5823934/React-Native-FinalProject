import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  TextInput,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import {
  getUserInfo,
  updateUserInfo,
  changeAvatarCam,
  changeAvatarLib,
  setDefaultAvatar,
} from '../config_auth';

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
      thumbnailURL: null,
      defaultURL: require('../images/user.png'),
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
    console.log(this.state.thumbnailURL);
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
      thumbnailURL: ref.userInfo.thumbnailURL || null,
    });
    console.log('userinfo loaded: ', ref.userInfo);
  };

  toogleEdit = () => {
    this.setState({
      editable: !this.state.editable,
    });
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

  renderSubmitButton = () => (
    <View
      style={{
        marginVertical: 20,
        marginHorizontal: 30,
        width: 200,
        backgroundColor: `${!this.state.editable ? 'gray' : 'blue'}`,
      }}>
      <Button
        title="Submit"
        color="#ffffff"
        onPress={this.update}
        disabled={!this.state.editable}
      />
    </View>
  );

  renderAvatar() {
    const picSource = this.state.thumbnailURL
      ? { uri: this.state.thumbnailURL }
      : this.state.defaultURL;

    return (
      <View style={{ alignItems: 'center' }}>
        <View
          style={{
            width: 164,
            height: 164,
            backgroundColor: 'white',
            borderRadius: 120,
            justifyContent: 'center',
          }}>
          <Image
            source={picSource}
            style={{
              width: 160,
              height: 160,
              alignSelf: 'center',
              borderRadius: 80,
            }}
          />
          {this.renderChangePicBtn()}
        </View>
      </View>
    );
  }

  renderChangePicBtn() {
    if (!this.state.editable) {
      return null;
    }
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          top: 125,
          right: 10,
          backgroundColor: 'white',
          borderRadius: 100,
          width: 30,
          height: 30,
        }}>
        <TouchableOpacity onPress={() => this.ActionSheet.show()}>
          <MaterialIcons
            name="add-a-photo"
            color="#4893bd"
            size={25}
            vertical-align="middle"
            paddingTop={4}
          />
          <View style={{ flex: 1.3 }}>
            {/* <Photo /> */}
            <ActionSheet
              ref={o => {
                this.ActionSheet = o;
              }}
              title={'Please Choose The Following'}
              options={[
                'Take Photo',
                'Choose From Library',
                'Delete Photo',
                'Cancel',
              ]}
              cancelButtonIndex={3}
              destructiveButtonIndex={2}
              onPress={this.handlePress}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  changeImgFromLib = async () => {
    const ref = await changeAvatarLib();
    console.log(ref);
    this.setState({ thumbnailURL: ref });
    console.log(this.state.thumbnailURL);
  };

  changeImgFromCam = async () => {
    const ref = await changeAvatarCam();
    console.log(ref);
    this.setState({ thumbnailURL: ref });
    console.log(this.state.thumbnailURL);
  };

  changeDefaultImage = async () => {
    const ref = await setDefaultAvatar();
    console.log(ref);
    this.setState({ thumbnailURL: ref });
    console.log(this.state.thumbnailURL);
  };

  handlePress = buttonIndex => {
    switch (buttonIndex) {
      case 0:
        this.changeImgFromCam();
        break;
      case 1:
        this.changeImgFromLib();
        break;
      case 2:
        this.changeDefaultImage();
        break;
      default:
        break;
    }
  };

  renderContent() {
    return (
      <View style={{ justifyContent: 'center' }}>
        <Text style={{ color: 'red' }}>{this.state.errMessage}</Text>
        <Text style={styles.text}>Name:</Text>
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
          editable={this.state.editable}
        />
        <Text style={styles.text}>Phone:</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: `${!this.state.editable ? 'gray' : 'blue'}` },
          ]}
          placeholder="Phone"
          onChangeText={this.handlePhoneChange}
          value={this.state.phone}
          underlineColorAndroid={'transparent'}
          multiline={false}
          editable={this.state.editable}
        />
        <Text style={styles.text}>School:</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: `${!this.state.editable ? 'gray' : 'blue'}` },
          ]}
          placeholder="School"
          onChangeText={this.handleSchoolChange}
          value={this.state.school}
          underlineColorAndroid={'transparent'}
          multiline={false}
          editable={this.state.editable}
        />
        <Text style={styles.text}>Major:</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: `${!this.state.editable ? 'gray' : 'blue'}` },
          ]}
          placeholder="Major"
          onChangeText={this.handleMajorChange}
          value={this.state.major}
          underlineColorAndroid={'transparent'}
          multiline={false}
          editable={this.state.editable}
        />
        <Text style={styles.text}>Insturctor:</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: `${!this.state.editable ? 'gray' : 'blue'}` },
          ]}
          placeholder="Instructor"
          onChangeText={this.handleInstructorChange}
          value={this.state.instructor}
          underlineColorAndroid={'transparent'}
          multiline={false}
          editable={this.state.editable}
        />
      </View>
    );
  }

  render() {
    return (
      <KeyboardAvoidingView behavior="padding" style={styles.profileContainer}>
        {this.renderAvatar()}
        {this.renderContent()}
        {this.renderSubmitButton()}
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 20,
  },
  text: {
    fontSize: 16,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  input: {
    justifyContent: 'center',
    borderStartWidth: 1.5,
    borderEndWidth: 1.5,
    borderWidth: 0.3,
    minWidth: 300,
    marginTop: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
});

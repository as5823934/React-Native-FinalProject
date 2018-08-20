import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
} from "react-native";
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
            loggedIn: false
        };
    }
    
    isEmailValid = (email) => {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return reg.test(email) != 0;
    }

    onLogin = () => {
        const { email, password } = this.state;
        this.setState({loading: true});
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          //if success
          .then(this.onSuccess)
          .catch(() => {
            //if not found-> create    
            firebase
              .auth()
              .createUserWithEmailAndPassword(email, password)
              .then(this.onCreateSuccess) //if success
              .catch(this.onFail); //if fail
            });
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

    onSuccess = async() => {
        const user = await firebase.auth().currentUser;
        this.setState({
            password: '',
            loading: false,
            errMessage: ''
        }, () => this.props.navigation.navigate('CheckIn', {Email: this.state.email, UID: user.uid}));
        console.log('logged in')
    };

    onCreateSuccess = async() => {
        this.setState({
            password: '',
            loading: false,
            errMessage: null
        }, () => this.props.navigation.navigate('Info', { Email: this.state.email }));
        console.log('create profile')
    }

    onFail = () => {
        const { email, password } = this.state;
        
        this.setState({
            errMessage: "Authentication fail.",
            loading: false
        });     
    }

    onRegister =() => {
        this.props.navigation.navigate("Info");
    }

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
                <View style={{ marginVertical: 20, marginHorizontal: 30 }}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
            );
        } else {
            return(
                <View style={{ marginVertical: 20, marginHorizontal: 30 }}>
                    <Button title="Login" onPress={this.onLogin} disabled={!this.state.isFormValid} />
                </View>
            );
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding" style={styles.container}>
                <View style={{ paddingVertical: 30 }}>
                <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>Attendants</Text>
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

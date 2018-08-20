import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button } from 'react-native';
import { Ionicons, Entypo } from "@expo/vector-icons";



export default class PortfolioScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editable: false,
        };
    }

    static navigationOptions = ({ navigation }) => {
        console.log(navigation);
        return {
            title: 'Protfolio',
            headerRight: (
                // <Button title='EDIT' onPress={()=> this.toogleEdit()}/>
                <TouchableOpacity
                    style={{ paddingRight: 10 }}
                    onPress={() => navigation.state.params.edit()}
                >
                    <Entypo
                        name='edit'
                        size={30}
                    />
                </TouchableOpacity>
            ),
        }
    };

    componentDidMount() {
        this.props.navigation.setParams({ edit: this.toogleEdit });
        console.log(this.props.navigation);
    }

    toogleEdit = () => {
        this.setState({ editable: !this.state.editable });
        console.log('edit: ', this.state.editable);
    }

    update = () => {
        this.setState({editable: false});
        alert('Information Updated');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>PortfolioScreen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});

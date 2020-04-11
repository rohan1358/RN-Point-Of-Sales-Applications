import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ImageBackground,
  Button,
} from 'react-native';
import Axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import {RefreshControlBase} from 'react-native';

export default class Login extends Component {
  constructor(props) {
    super(props);
    let loggedIn = false;
    this.state = {
      name: '',
      password: '',
      token: '',
      loggedIn,
    };
  }

  UNSAFE_componentWillMount = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      console.log(value);
      if (value !== null) {
        this.props.navigation.navigate('Home');
      }
    } catch (error) {
      console.log(error);
    }
  };
  validateUser = async () => {
    try {
      const response = await Axios.post(
        'http://54.158.219.28:8011/api/v1/user/login',
        this.state,
      );
      this.setState({
        loggedIn: true,
        token: response.data.token,
      });
      try {
        await AsyncStorage.setItem('token', this.state.token);
        await AsyncStorage.setItem('user', this.state.name);
      } catch (error) {
        console.log(error);
      }
      if (response.data.token === undefined) {
        Alert.alert('username atau password salah');
      } else {
        this.props.navigation.navigate('Home');
      }
    } catch (err) {
      this.setState({
        loading: false,
        error: true,
      });
    }
  };
  reload = () => {
    RefreshControlBase();
  };
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.imagebg}
          source={require('../assets/image/bg.jpg')}>
          <View style={styles.sectionTitle}>
            <Image
              source={require('../assets/image/hw.png')}
              alt="hello world"
            />
          </View>
          <View style={styles.sectionForm}>
            <TextInput
              style={[styles.input, styles.username]}
              placeholder="Username"
              onChangeText={value => this.setState({name: value})}
            />
            <TextInput
              secureTextEntry={true}
              style={[styles.input, styles.password]}
              placeholder="Password"
              onChangeText={value => this.setState({password: value})}
            />
            <TouchableOpacity onPress={this.validateUser}>
              <View style={styles.button}>
                <Text style={styles.fontLogin}>Login</Text>
              </View>
            </TouchableOpacity>
            <Button title="Reload" onPress={() => this.reload()} />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffeee',
    flexDirection: 'column',
  },
  sectionTitle: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionForm: {
    flex: 4,
    padding: 15,
  },
  sectionButton: {
    backgroundColor: 'green',
    flex: 5,
    alignItems: 'center',
    marginTop: 0,
  },
  input: {
    marginTop: 0,
    color: 'white',
    borderRadius: 5,
    fontSize: 20,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  username: {
    marginTop: 10,
  },
  password: {
    marginTop: 30,
  },
  button: {
    margin: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#1b9094',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontLogin: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'white',
  },
  imagebg: {
    width: '100%',
    height: '100%',
  },
});

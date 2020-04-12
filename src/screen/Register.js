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
    this.state = {
      name: '',
      password: '',
      email: '',
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
    console.log('masuk validate user');
    const state = this.state;
    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.email) === true && this.state.password.length > 5) {
      Axios.post('http://54.158.219.28:8011/api/v1/user/insert', state)
        .then(Alert.alert('register success'))
        .then(this.props.navigation.navigate('Login'))
        .catch(error => {
          console.log(error);
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
              style={[styles.input, styles.username, styles.dbl]}
              placeholder="Email"
              onChangeText={value => this.setState({email: value})}
            />
            <TextInput
              secureTextEntry={true}
              style={[styles.input, styles.password]}
              placeholder="Password"
              onChangeText={value => this.setState({password: value})}
            />
            <TouchableOpacity onPress={() => this.validateUser()}>
              <View style={styles.button}>
                <Text style={styles.fontLogin}>Register</Text>
              </View>
            </TouchableOpacity>
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

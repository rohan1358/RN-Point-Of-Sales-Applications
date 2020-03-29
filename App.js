import React, {Component} from 'react';
import Detail from './src/screen/Detail';
import Login from './src/screen/Login';
import {createStackNavigator} from '@react-navigation/stack';
import Navigator from './src/navigators/Navigators';
import {NavigationContainer} from '@react-navigation/native';
import Edit from './src/screen/EditProduct';
const Stack = createStackNavigator();

class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode="none">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Navigator" component={Navigator} />
          <Stack.Screen name="Detail" component={Detail} />
          <Stack.Screen name="Edit" component={Edit} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
export default App;

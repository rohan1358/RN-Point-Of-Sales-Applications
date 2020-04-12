import React from 'react';
import Login from './src/screen/Login';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import Edit from './src/screen/EditProduct';
import Home from './src/screen/Home';
import Cart from './src/screen/Cart';
const Stack = createStackNavigator();
import {Provider} from 'react-redux';
import store from './redux/store';
import Add from './src/screen/Add';
import History from './src/screen/History';
import Register from './src/screen/Register';
const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Add" component={Add} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="Edit" component={Edit} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Register" component={Register} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <MainNavigator />
    </Provider>
  );
};

export default App;

import React from 'react';
// import {View, Text} from 'react-native';
// import Home from '../../screens/Home';
import Add from '../screen/Add';
import Home from '../screen/Home';
import Cart from '../screen/Cart';
import History from '../screen/History';
import Edit from '../screen/EditProduct';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import {Ionicons} from '@expo/vector-icons';
// import {NavigationContainer} from '@react-navigation/native';

const Bottom = createBottomTabNavigator();
const MainNavigators = () => {
  return (
    <Bottom.Navigator initialRouteName="Home" headerMode="none">
      <Bottom.Screen name="Home" component={Home} />
      <Bottom.Screen name="Add" component={Add} />
      <Bottom.Screen name="Cart" component={Cart} />
      <Bottom.Screen name="History" component={History} />
    </Bottom.Navigator>
  );
};

export default MainNavigators;

import React from 'react';
import {LoginScreen} from '../screens/LoginScreen';
import {SingupScreen} from '../screens/SingupScreen';
import {LaunchScreen} from '../screens/LaunchScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export const StackNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Launch" component={LaunchScreen} />
      <Stack.Screen name="Home" component={LoginScreen} />
      <Stack.Screen name="Profile" component={SingupScreen} />
    </Stack.Navigator>
  );
};

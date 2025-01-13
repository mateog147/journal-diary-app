/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer, StaticScreenProps} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {SingupScreen} from './src/screens/SingupScreen';
import {LoginScreen} from './src/screens/LoginScreen';
import {LaunchScreen} from './src/screens/LaunchScreen';
import {StackNavigation} from './src/navigation/StackNavigation';

const Stack = createNativeStackNavigator();

type Props = StaticScreenProps<{
  username: string;
}>;

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <StackNavigation />
    </NavigationContainer>
  );
}

export default App;

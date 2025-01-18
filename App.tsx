/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer, StaticScreenProps} from '@react-navigation/native';
import React from 'react';
import {StackNavigation} from './src/navigation/StackNavigation';
import {store} from './src/store/store';
import {Provider} from 'react-redux';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StackNavigation />
      </NavigationContainer>
    </Provider>
  );
}

export default App;

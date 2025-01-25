import {ActivityIndicator, Text, TextInput, View} from 'react-native';
import React from 'react';
import {SingupForm} from '../components/organism/SingupForm';

export const SingupScreen = ({navigation}: any) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <SingupForm
        goToLoginAction={() => {
          navigation.navigate('Login');
        }}
        singupAction={() => {
          navigation.navigate('Home');
        }}
      />
    </View>
  );
};

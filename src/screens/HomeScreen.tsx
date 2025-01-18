import {ActivityIndicator, Text, TextInput, View} from 'react-native';
import React from 'react';
import {useSelector} from 'react-redux';
import {RootState} from '../store/store';

export const HomeScreen = () => {
  const {token} = useSelector((state: RootState) => state.token);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>HOME!!! 🎉</Text>
      <Text>{token}</Text>
    </View>
  );
};

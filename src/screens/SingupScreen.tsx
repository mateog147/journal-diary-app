import {ActivityIndicator, Text, TextInput, View, KeyboardAvoidingView, ScrollView, Platform} from 'react-native';
import React from 'react';
import {SingupForm} from '../components/organism/SingupForm';

export const SingupScreen = ({navigation}: any) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        width: '100%',
        backgroundColor: '#ffffff',
      }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          width: '100%',
          backgroundColor: '#ffffff',
        }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        style={{backgroundColor: '#ffffff'}}>
        <View
          style={{
            flex: 1,
            width: '100%',
            paddingHorizontal: 16,
            backgroundColor: '#ffffff',
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

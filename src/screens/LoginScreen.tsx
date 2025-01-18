import {Alert, BackHandler, StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import {LoginForm} from '../components/organism/LoginForm';
import {setToken} from '../store/reducers/token';

export const LoginScreen = ({navigation}: any) => {
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('Hold on!', 'Are you sure you want to go back?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      } else {
        return false;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.loginScreen}>
      <LoginForm
        loginAction={() => {
          navigation.navigate('Home');
        }}
        singupAction={() => {
          navigation.navigate('Singup');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loginScreen: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

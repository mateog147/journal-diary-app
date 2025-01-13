import {
  ActivityIndicator,
  Alert,
  BackHandler,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {FormInput} from '../components/molecules/FormInput';
import {MainButton} from '../components/atoms/MainButton';

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
    <View style={styles.formContainer}>
      <Text>Wellcome!</Text>
      <FormInput icon="person" errorMsg="Not Valid" title="Email" />
      <FormInput
        icon="person"
        errorMsg="Not Valid"
        title="Password"
        isSecureInput={true}
      />
      <MainButton
        text="Login"
        action={() => {
          navigation.navigate('Profile');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    minHeight: 200,
    backgroundColor: '#ffffff',
  },

  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
  },
});

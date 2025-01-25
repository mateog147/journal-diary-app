import {Alert, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {MainButton} from '../atoms/MainButton';
import {AnchorMessage} from '../atoms/AnchorMesage';
import {MainTitle} from '../atoms/MainTitle';
import {FormInput} from '../molecules/FormInput';
import {useDispatch, useSelector} from 'react-redux';
import {LoginDto} from '../../interfaces/LoginDto';
import {AuthService} from '../../store/services/AuthService';
import {RootState} from '../../store/store';
import {setToken} from '../../store/reducers/token';

interface Props {
  loginAction: () => void;
  singupAction?: () => void;
}
export const LoginForm = ({loginAction, singupAction}: Props) => {
  const dispatch = useDispatch();
  const {token} = useSelector((state: RootState) => state.token);
  const [email, onChangeEmail] = React.useState('');
  const [pwd, onChangePwd] = React.useState('');

  const loginDto: LoginDto = {
    password: pwd,
    userName: email,
  };
  const authService = AuthService();

  const onLogin = async () => {
    const token = await authService.login({
      ...loginDto,
    });
    console.log('token :>> ', token);
    dispatch(setToken(token ?? ''));
    if (!token) {
      Alert.alert('Invalid user or password');
    } else {
      loginAction();
    }
  };
  return (
    <View style={styles.formContainer}>
      <MainTitle title="Welcome Back!" />
      <View style={styles.inputsContainer}>
        <FormInput
          errorMsg="Not Valid"
          title="Email"
          onChangeInput={onChangeEmail}
        />
        <FormInput
          errorMsg="Not Valid"
          title="Password"
          isSecureInput={true}
          onChangeInput={onChangePwd}
        />
      </View>

      <View style={styles.buttonContainer}>
        <MainButton text="Login" action={onLogin} />
        <AnchorMessage
          initialText="Don´t have an account?"
          boldText="Sing up"
          action={singupAction}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    minHeight: 200,
    maxHeight: '100%',
    backgroundColor: '#ffffff',
  },

  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
  },
  inputsContainer: {},
});

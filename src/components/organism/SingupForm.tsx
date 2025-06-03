import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import React from 'react';
import { MainButton } from '../atoms/MainButton';
import { AnchorMessage } from '../atoms/AnchorMesage';
import { MainTitle } from '../atoms/MainTitle';
import { FormInput } from '../molecules/FormInput';
import { useDispatch, useSelector } from 'react-redux';
import { LoginDto } from '../../interfaces/LoginDto';
import { AuthService } from '../../store/services/AuthService';
import { RootState } from '../../store/store';
import { setToken } from '../../store/reducers/token';
import { FormSelectPiecker } from '../molecules/FormSelectPiecker';
import { GENDERS } from '../../../types/constants/gender';
import { SingupDto } from '../../interfaces/SingupDto';
import { UserService } from '../../store/services/UserService';
import { COLORS } from '../../themes/constants/styles-constants';

interface Props {
  singupAction: () => void;
  goToLoginAction?: () => void;
}
export const SingupForm = ({ goToLoginAction, singupAction }: Props) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state: RootState) => state.token);
  const [email, onChangeEmail] = React.useState('');
  const [name, onChangeName] = React.useState('');
  const [lastName, onChangeLastName] = React.useState('');
  const [pwd, onChangePwd] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [birthdate, setBirthdate] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const singupDto: SingupDto = {
    password: pwd,
    email: email,
    name: name,
    lastName: lastName,
    gender: gender,
    birthDay: birthdate,
  };
  const userService = UserService();
  const authService = AuthService();

  const onSingUp = async () => {
    setLoading(true);
    const user = await userService.singUp({
      ...singupDto,
    });
    console.log('user :>> ', user);

    const token = await authService.login({
      password: pwd,
      userName: email,
    });
    console.log('token :>> ', token);
    dispatch(setToken(token ?? ''));
    if (!user) {
      Alert.alert('Error, please try again later');
    } else {
      singupAction();
    }
    setLoading(false);

  };
  return (
    <View style={styles.formContainer}>
      <MainTitle title="Create a new account" />

      <View style={styles.inputsContainer}>
        <FormInput
          errorMsg="Not Valid"
          title="Email"
          onChangeInput={onChangeEmail}
        />
        <FormInput
          errorMsg="Not Valid"
          title="First name"
          onChangeInput={onChangeName}
        />
        <FormInput
          errorMsg="Not Valid"
          title="Last name"
          onChangeInput={onChangeLastName}
        />
        <FormInput
          errorMsg="Not Valid"
          title="Bith date"
          onChangeInput={setBirthdate}
        />
        <FormSelectPiecker
          title="Gender"
          value={gender}
          setValue={setGender}
          options={[...GENDERS]}
        />
        <FormInput
          errorMsg="Not Valid"
          title="Password"
          isSecureInput={true}
          onChangeInput={onChangePwd}
        />
      </View>

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.mainColor} />
        ) : (
          <MainButton text="Sign Up" action={onSingUp} />
        )}
        <AnchorMessage
          initialText="Already have an account?"
          boldText="Login"
          action={goToLoginAction}
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

import {
  Alert,
  BackHandler,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { UserService } from '../store/services/UserService';
import { emptyUser, setUser } from '../store/reducers/user';
import { HomeEntriesComponent } from '../components/organism/HomeEntries';

export const HomeScreen = ({ navigation, route }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const userService = UserService();

  useEffect(() => {
    if (!user?.userName) {
      userService
        .getClient()
        .then(user => {
          console.log('user :>> ', user);
          dispatch(setUser(user ?? emptyUser));
        })
        .catch(() => {
          console.log('catch');
        });
    }
  });
  useEffect(() => {
    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('Hold on!', 'Are you sure you want exit', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          { text: 'YES', onPress: () => navigation.navigate('Login') },
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
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <HomeEntriesComponent navigation={navigation} refreshTrigger={route.params?.refresh} />
    </View>
  );
};

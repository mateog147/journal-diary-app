import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  View} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { UserService } from '../store/services/UserService';
import { emptyUser, setUser } from '../store/reducers/user';
import { COLORS } from '../themes/constants/styles-constants';
import { MainTitle } from '../components/atoms/MainTitle';

export const ProfileScreen = ({ navigation }: any) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const userService = UserService();
  const [loading, setLoading] = useState(!user?.userName);

  useEffect(() => {
    if (!user?.userName) {
      setLoading(true);
      userService.getClient().then(user => {
        dispatch(setUser(user ?? emptyUser));
        setLoading(false);
      });
    }
  }, []);

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
    <View style={styles.container}>
      <MainTitle title='User Information'/>
      {loading ? (
        <ActivityIndicator 
          testID="loading-indicator"
          size="large" 
          color={COLORS.mainColor} 
          style={{ marginTop: 40 }} 
        />
      ) : (
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>First Name: </Text>
            <Text style={styles.value}>{user.contactInfo?.name || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Last Name: </Text>
            <Text style={styles.value}>{user.contactInfo?.lastName || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email: </Text>
            <Text style={styles.value}>{user.contactInfo?.email || '-'}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fbfd',
    paddingHorizontal: 24,
    paddingTop: 24,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  infoContainer: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  label: {
    fontSize: 18,
    color: COLORS.tertiaryColor,
    fontWeight: '400',
  },
  value: {
    fontSize: 16,
    color: COLORS.tertiaryColor,
    fontWeight: '500',
  },
});

import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {Isologo} from '../components/atoms/Isologo';
import {MyStackScreenProps} from '../interfaces/MyStackScreenProps';
import { COLORS } from '../themes/constants/styles-constants';

export const LaunchScreen = ({navigation}: MyStackScreenProps) => {
  useEffect(() => {
    setTimeout(() => navigation.navigate('Login'), 1000);
  });
  return (
    <View>
      <View style={styles.container}>
        <Isologo customStyle={styles.logo} size={144} />
        <Text style={styles.title}>My Diary</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
  },
  title: {
    color: COLORS.mainColor,
    fontSize: 30,
    fontWeight: '500',
    position: 'absolute',
    bottom: '9%',
  },
});

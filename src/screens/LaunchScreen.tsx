import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {Isologo} from '../components/atoms/Isologo';
import {MyStackScreenProps} from '../interfaces/MyStackScreenProps';

export const LaunchScreen = ({navigation}: MyStackScreenProps) => {
  useEffect(() => {
    setTimeout(() => navigation.navigate('Home'), 1000);
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
    color: 'black',
    fontSize: 28,
    fontWeight: '400',
    position: 'absolute',
    bottom: '9%',
  },
});

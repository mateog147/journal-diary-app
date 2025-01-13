import React from 'react';
import {Image, StyleSheet} from 'react-native';

interface Props {
  size?: number;
  customStyle?: any;
}

export const Isologo = ({size, customStyle}: Props) => {
  return (
    <Image
      style={getLogoStyles(size, customStyle)}
      source={require('../../assets/images/logo.png')}
    />
  );
};

function getLogoStyles(size?: number, customStyle?: any) {
  return size
    ? {...styles.logo, width: size, height: size, ...customStyle}
    : styles.logo;
}

const styles = StyleSheet.create({
  logo: {
    width: 144,
    height: 144,
  },
});

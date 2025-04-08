import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../themes/constants/styles-constants';

interface Props {
  title: string;
  size?: number;
  customStyle?: any;
}

export const EntryListItem = ({title, size, customStyle}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={getTitleStyles(size, customStyle)}>{title}</Text>
    </View>
  );
};

function getTitleStyles(size?: number, customStyle?: any) {
  return size
    ? {...styles.title, width: size, height: size, ...customStyle}
    : styles.title;
}

const styles = StyleSheet.create({
  title: {
    color: `${COLORS.secondaryColor}`,
    fontSize: 38,
  },
  container: {
    backgroundColor: 'pink',
  },
});

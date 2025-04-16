import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../themes/constants/styles-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IconButton } from '../atoms/IconButton';

interface Props {
  title: string;
  size?: number;
  customStyle?: any;
}

export const EntryListItem = ({title, size, customStyle}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={getTitleStyles(size, customStyle)}>{title}</Text>
      <View style={styles.iconContainer}>
        <IconButton iconName='book' size={38} />
        <IconButton iconName='trash' size={38} />
      </View>
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
    color: `${COLORS.tertiaryColor}`,
    fontSize: 20,
  },
  container: {
    backgroundColor: `${COLORS.mainColor}`,
    height: 44,
    width: '90%',
    margin: 8,
    alignSelf: 'flex-end',
    padding: 4,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  iconContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-evenly',
    width: '20%'
  },
});

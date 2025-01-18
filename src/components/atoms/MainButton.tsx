import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {RootState} from '../../store/store';
import {useSelector} from 'react-redux';
import {COLORS} from '../../themes/constants/styles-constants';

interface Props {
  text: string;
  width?: number;
  backgroundColor?: string;
  color?: string;
  action?: (textNumber: string) => void;
}

export const MainButton = ({
  text,
  width,
  backgroundColor,
  color,
  action,
}: Props) => {
  const styles = StyleSheet.create({
    btn: {
      backgroundColor: backgroundColor
        ? backgroundColor
        : `${COLORS.secondaryColor}`,
      height: 60,
      width: width ? `${width}%` : '92%',
      alignSelf: 'center',
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.24,
      shadowRadius: 6,

      elevation: 17,
    },
    btnText: {
      fontFamily: 'Roboto',
      fontSize: 20,
      color: color ? color : 'white',
      fontWeight: '600',
    },
  });
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={() => (action ? action(text) : console.log({text}))}>
      <Text style={styles.btnText}>{text}</Text>
    </TouchableOpacity>
  );
};

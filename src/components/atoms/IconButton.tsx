import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {COLORS} from '../../themes/constants/styles-constants';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Props {
  size?: number;
  borderRadius?: number;
  color?: string;
  action?: (textNumber: string) => void;
  iconName: string;
}

export const IconButton = ({
  size,
  borderRadius,
  color,
  iconName,
  action,
}: Props) => {
  const styles = StyleSheet.create({
    btn: {
      backgroundColor: color ? color : `${COLORS.mainColor}`,
      height: size ? size : 50,
      width: size ? size : 50,
      borderRadius: borderRadius ? borderRadius : 10,
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
      onPress={() => (action ? action('') : console.log('icon buton press'))}
      accessibilityRole="button">
      <Ionicons
        name={iconName}
        size={size ? size - 6 : 22}
        color={COLORS.tertiaryColor}
        testID="icon-button-icon"
      />
    </TouchableOpacity>
  );
};

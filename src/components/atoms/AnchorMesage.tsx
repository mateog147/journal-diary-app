import {
  TextInput,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {COLORS} from '../../themes/constants/styles-constants';

interface Props {
  initialText: string;
  action?: () => void;
  boldText: string;
}
export const AnchorMessage = ({initialText, boldText, action}: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.initialText}>{initialText} </Text>
      <TouchableOpacity onPress={() => (action ? action() : console.log({boldText}))}>
        <Text style={styles.pressableText}>{boldText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    width: '92%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  pressableText: {
    fontWeight: 'bold',
    color: COLORS.secondaryColor,
  },
  initialText: {
    color: COLORS.tertiaryColor,
  },
});

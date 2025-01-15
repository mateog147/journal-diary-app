import {TextInput, View, StyleSheet, Text} from 'react-native';
import React from 'react';
import {COLORS} from '../../themes/constants/styles-constants';

interface Props {
  placeholder?: string;
  onChangeAction?: (value: string) => void;
  value?: string;
  isNumeric?: boolean;
  isSecureInput?: boolean;
}
export const FormTextInput = ({
  placeholder,
  value,
  isNumeric,
  onChangeAction,
  isSecureInput,
}: Props) => {
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={onChangeAction}
        style={styles.input}
        placeholder={placeholder}
        value={value}
        keyboardType={isNumeric ? 'numeric' : 'default'}
        secureTextEntry={isSecureInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomColor: `${COLORS.mainColor}`,
    borderBottomWidth: 2,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    height: 53,
  },
  input: {
    fontSize: 18,
  },
});

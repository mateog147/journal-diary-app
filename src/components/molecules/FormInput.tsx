import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {FormTextInput} from '../atoms/FormTextInput';
import {COLORS} from '../../themes/constants/styles-constants';

interface Props {
  icon?: string;
  placeholder?: string;
  isInvalid?: boolean;
  errorMsg?: string;
  onChangeInput?: (text: string) => void;
  value?: string;
  isNumeric?: boolean;
  title?: string;
  isSecureInput?: boolean;
  height?: number;
  maxLength?: number;
}
export const FormInput = ({
  icon,
  placeholder,
  isInvalid,
  errorMsg,
  value,
  onChangeInput,
  isNumeric,
  title,
  isSecureInput,
  height,
  maxLength
}: Props) => {
  const styles = StyleSheet.create({
    container: {flexDirection: 'row', alignSelf: 'center', width: '92%'},
    textContainer: {flexDirection: 'column', flex: 1},
    errorTxt: {
      color: isInvalid ? 'red' : 'white',
    },
    title: {
      color: COLORS.tertiaryColor,
      fontSize: 16,
    },
  });
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <FormTextInput
          value={value}
          isNumeric={isNumeric}
          onChangeAction={onChangeInput}
          placeholder={placeholder}
          isSecureInput={isSecureInput}
          height={height}
          maxLength={maxLength}
        />
        <Text style={styles.errorTxt}>{errorMsg ? errorMsg : 'Error'}</Text>
      </View>
    </View>
  );
};

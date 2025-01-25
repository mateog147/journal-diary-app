import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {FormTextInput} from '../atoms/FormTextInput';
import {COLORS} from '../../themes/constants/styles-constants';
import {SelectPiecker} from '../atoms/SelectPicker';

interface Props {
  isInvalid?: boolean;
  errorMsg?: string;
  title?: string;
  value: any;
  setValue: any;
  options: {label: string; value: any}[];
}
export const FormSelectPiecker = ({
  isInvalid,
  errorMsg,
  value,
  title,
  setValue,
  options
}: Props) => {
  const styles = StyleSheet.create({
    container: {flexDirection: 'row', alignSelf: 'flex-start', width: '60%'},
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
        <SelectPiecker
          value={value}
          setValue={setValue}
          options={options}
        />
        <Text style={styles.errorTxt}>{errorMsg ? errorMsg : 'Error'}</Text>
      </View>
    </View>
  );
};

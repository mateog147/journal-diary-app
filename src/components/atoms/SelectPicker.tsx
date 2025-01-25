import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../../themes/constants/styles-constants';
import DropDownPicker from 'react-native-dropdown-picker';

interface Props {
  value: any;
  setValue: any;
  options: {label: string; value: any}[];
}

export const SelectPiecker = ({value, setValue, options}: Props) => {
  const [open, setOpen] = React.useState(false);

  const [items, setItems] = React.useState([...options]);
  return (
    <View>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        textStyle={{
          fontSize: 18,
        }}
        style={{
          borderColor: COLORS.mainColor,
          borderWidth: 2,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  piecker: {
    color: `${COLORS.secondaryColor}`,
    fontSize: 38,
  },
});

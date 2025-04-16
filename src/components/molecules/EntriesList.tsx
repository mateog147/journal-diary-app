import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';
import {FormTextInput} from '../atoms/FormTextInput';
import {COLORS} from '../../themes/constants/styles-constants';
import {SelectPiecker} from '../atoms/SelectPicker';
import {IEntry} from '../../interfaces/EntryInterface';
import {EntryListItem} from './EntryListItem';

interface Props {
  entries: IEntry[];
}
export const EntriesList = ({entries}: Props) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignSelf: 'flex-start',
      width: '100%',
      alignItems: 'flex-end',
    },
    listContainer: {
      flexDirection: 'column',
      flex: 1,
      justifyContent: 'space-evenly',
    },
    item: {
      color: COLORS.tertiaryColor,
      fontSize: 16,
    },
  });
  if (!entries || entries.length == 0) {
    return (
      <View style={styles.container}>
        <Text>You do not have entries for this day</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={[...entries]}
        renderItem={({item}) => (
          <EntryListItem
            title={item.title}
            customStyle={styles.listContainer}
          />
        )}
      />
    </View>
  );
};

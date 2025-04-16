import {Alert, StyleSheet, View} from 'react-native';
import React from 'react';
import {MainTitle} from '../atoms/MainTitle';
import {useDispatch} from 'react-redux';
import {EntryService} from '../../store/services/EntryService';
import {Calendar} from 'react-native-calendars';
import {EntriesList} from '../molecules/EntriesList';
import {IEntry} from '../../interfaces/EntryInterface';
import {IconButton} from '../atoms/IconButton';
import {COLORS} from '../../themes/constants/styles-constants';

interface Props {
  onCreatedEntry?: () => void;
}
export const HomeEntriesComponent = ({onCreatedEntry}: Props) => {
  const dispatch = useDispatch();
  const [title, onChangeTitle] = React.useState('');
  const [entries, setEntries] = React.useState<IEntry[]>([]);
  const [selected, setSelected] = React.useState(
    new Date().toISOString().slice(0, 10),
  );

  const entryService = EntryService();

  const refreshEntriesByDate = async (dateStr: string) => {
    const entriesFetch = await entryService.getClientEntriesByDate(dateStr);
    console.log('entries :>> ', entriesFetch);
    if (!entriesFetch) {
      Alert.alert('Error try again');
    } else {
      setEntries([...entriesFetch]);
    }
  };
  return (
    <View style={styles.formContainer}>
      <Calendar
        onDayPress={(day: any) => {
          setSelected(day.dateString);
          refreshEntriesByDate(day.dateString);
        }}
        markedDates={{
          [selected]: {
            selected: true,
            disableTouchEvent: true,
            selectedDotColor: 'orange',
          },
        }}
      />
      <MainTitle title="Recent Entries" />
      <EntriesList entries={[...entries]} />
      <View style={styles.buttonContainer}>
        <IconButton
          iconName="add-circle-outline"
          action={() => {}}
          color={COLORS.secondaryColor}
          size={70}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: '100%',
    minHeight: 200,
    maxHeight: '100%',
    backgroundColor: '#ffffff',
  },

  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    display: 'flex',
    alignItems: 'flex-end',
    padding: 4
  },
  inputsContainer: {},
});

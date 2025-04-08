import {Alert, StyleSheet, View} from 'react-native';
import React from 'react';
import {MainButton} from '../atoms/MainButton';
import {MainTitle} from '../atoms/MainTitle';
import {FormInput} from '../molecules/FormInput';
import {useDispatch} from 'react-redux';
import {LoginDto} from '../../interfaces/LoginDto';
import {CreateEntryDto} from '../../interfaces/EntryDto';
import {EntryService} from '../../store/services/EntryService';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import {EntriesList} from '../molecules/EntriesList';
import {IEntry} from '../../interfaces/EntryInterface';

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
        <MainButton text="Submit" action={() => {}} />
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
  },
  inputsContainer: {},
});

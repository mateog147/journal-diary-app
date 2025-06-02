import { Alert, StyleSheet, View, ActivityIndicator } from 'react-native';
import React from 'react';
import { MainTitle } from '../atoms/MainTitle';
import { useDispatch } from 'react-redux';
import { EntryService } from '../../store/services/EntryService';
import { Calendar } from 'react-native-calendars';
import { EntriesList } from '../molecules/EntriesList';
import { IEntry } from '../../interfaces/EntryInterface';
import { IconButton } from '../atoms/IconButton';
import { COLORS } from '../../themes/constants/styles-constants';

interface Props {
  navigation: any;
  onCreatedEntry?: () => void;
  refreshTrigger?: boolean;
}
export const HomeEntriesComponent = ({ navigation, onCreatedEntry, refreshTrigger }: Props) => {
  const dispatch = useDispatch();
  const [title, onChangeTitle] = React.useState('');
  const [entries, setEntries] = React.useState<IEntry[]>([]);
  const [selected, setSelected] = React.useState(
    new Date().toISOString().slice(0, 10),
  );
  const [loading, setLoading] = React.useState(false);

  const entryService = EntryService();

  const refreshEntriesByDate = async (dateStr: string) => {
    setLoading(true);
    try {
      const entriesFetch = await entryService.getClientEntriesByDate(dateStr);
      console.log('entries :>> ', entriesFetch);
      if (!entriesFetch) {
        Alert.alert('Error try again');
      } else {
        setEntries([...entriesFetch]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditEntry = (entry: IEntry) => {
    console.log('Edit entry:', entry);
    navigation.navigate('Entry', { entry });
  };

  const handleDeleteEntry = (entry: IEntry) => {
    Alert.alert(
      'Delete Entry',
      `Are you sure you want to delete "${entry.title}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (entry.id) {
              const success = await entryService.deleteEntry(entry.id);
              if (success) {
                refreshEntriesByDate(selected);
              } else {
                Alert.alert('Error', 'Failed to delete entry. Please try again.');
              }
            }
          },
        },
      ],
    );
  };

  // Add this useEffect to refresh entries when navigating back
  React.useEffect(() => {
    if (refreshTrigger) {
      refreshEntriesByDate(selected);
      // Reset the navigation parameter after refreshing
      navigation.setParams({ refresh: undefined });
    }
  }, [refreshTrigger]);

  // Add this useEffect to load entries when the component mounts
  React.useEffect(() => {
    refreshEntriesByDate(selected);
  }, []);

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
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.mainColor} />
      ) : (
        <EntriesList
          entries={[...entries]}
          onEditEntry={handleEditEntry}
          onDeleteEntry={handleDeleteEntry}
        />
      )}
      <View style={styles.buttonContainer}>
        <IconButton
          iconName="add-circle-outline"
          action={() => {
            navigation.navigate('Entry', { entry: undefined });
          }}
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

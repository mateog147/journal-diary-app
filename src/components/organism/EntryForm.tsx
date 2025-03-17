import {Alert, StyleSheet, View} from 'react-native';
import React from 'react';
import {MainButton} from '../atoms/MainButton';
import {MainTitle} from '../atoms/MainTitle';
import {FormInput} from '../molecules/FormInput';
import {useDispatch} from 'react-redux';
import {LoginDto} from '../../interfaces/LoginDto';
import {CreateEntryDto} from '../../interfaces/EntryDto';
import {EntryService} from '../../store/services/EntryService';

interface Props {
  onCreatedEntry: () => void;
}
export const EntryForm = ({onCreatedEntry}: Props) => {
  const dispatch = useDispatch();
  const [title, onChangeTitle] = React.useState('');
  const [content, onChangeContent] = React.useState('');

  const createEntryDto: CreateEntryDto = {
    title: title,
    content: '',
  };
  const entryService = EntryService();

  const onLogin = async () => {
    const entry = await entryService.createEntry({
      ...createEntryDto,
    });
    console.log('token :>> ', entry);
    if (!entry) {
      Alert.alert('Error try again');
    } else {
      onCreatedEntry();
    }
  };
  return (
    <View style={styles.formContainer}>
      <MainTitle title="What are you thinking today?" />
      <View style={styles.inputsContainer}>
        <FormInput
          errorMsg="Not Valid"
          title="Title"
          onChangeInput={onChangeTitle}
        />
        <FormInput
          errorMsg="Not Valid"
          title="Password"
          onChangeInput={onChangeContent}
        />
      </View>

      <View style={styles.buttonContainer}>
        <MainButton text="Login" action={onLogin} />
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

import { Alert, StyleSheet, View, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';
import { MainButton } from '../atoms/MainButton';
import { MainTitle } from '../atoms/MainTitle';
import { FormInput } from '../molecules/FormInput';
import { useDispatch } from 'react-redux';
import { CreateEntryDto } from '../../interfaces/EntryDto';
import { EntryService } from '../../store/services/EntryService';
import { IEntry } from '../../interfaces/EntryInterface';
import { COLORS } from '../../themes/constants/styles-constants';

interface Props {
  onCreatedEntry: () => void;
  entry?: IEntry;
}
export const EntryForm = ({ onCreatedEntry, entry }: Props) => {
  const dispatch = useDispatch();
  const [title, onChangeTitle] = React.useState(entry?.title || '');
  const [content, onChangeContent] = React.useState(entry?.content || '');
  const [isEditing, setIsEditing] = React.useState(!!entry);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (entry) {
      onChangeTitle(entry.title);
      onChangeContent(entry.content);
      setIsEditing(true);
    } else {
      onChangeTitle('');
      onChangeContent('');
      setIsEditing(false);
    }
  }, [entry]);

  const createEntryDto: CreateEntryDto = {
    title: title,
    content: content,
  };
  const entryService = EntryService();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Title and content are required');
      return;
    }

    setLoading(true);
    try {
      let result;
      if (isEditing && entry?.id) {
        result = await entryService.updateEntry(entry.id, createEntryDto);
      } else {
        result = await entryService.createEntry(createEntryDto);
      }

      if (!result) {
        Alert.alert('Error', 'Failed to save entry. Please try again.');
      } else {
        console.log('Entry saved successfully');
        entry = undefined;
        onCreatedEntry();
      }
    } catch (error) {
      console.error('Entry save error:', error);
      Alert.alert('Error', 'An error occurred while saving the entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      <MainTitle title={isEditing ? "Edit your entry" : "What are you thinking today?"} />
      <View style={styles.inputsContainer}>
        <FormInput
          errorMsg="Not Valid"
          title="Title"
          placeholder="Title"
          onChangeInput={onChangeTitle}
          value={title}
        />
        <FormInput
          errorMsg="Not Valid"
          title="Story"
          placeholder="Story"
          onChangeInput={onChangeContent}
          height={360}
          maxLength={1000}
          value={content}
          multiline={true}
        />
      </View>

      <View style={styles.buttonContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.mainColor} />
        ) : (
          <MainButton text={isEditing ? "Update" : "Submit"} action={handleSubmit} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    flexDirection: 'column',
    width: '100%',
    paddingVertical: 16,
  },
  text: {
    color: 'black',
    fontSize: 18,
    fontWeight: '400',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    paddingBottom: 20,
  },
  inputsContainer: {
    width: '100%',
    marginTop: 16,
  },
});

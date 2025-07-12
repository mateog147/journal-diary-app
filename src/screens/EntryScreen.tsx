import {Alert, BackHandler, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../store/store';
import {UserService} from '../store/services/UserService';
import {emptyUser, setUser} from '../store/reducers/user';
import {EntryForm} from '../components/organism/EntryForm';
import {IEntry} from '../interfaces/EntryInterface';

export const EntryScreen = ({navigation, route}: any) => {
  const dispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.user);
  const userService = UserService();
  const [selectedEntry, setSelectedEntry] = useState<IEntry | undefined>(
    route.params?.entry,
  );

  useEffect(() => {
    console.log('usando efecto  :>> ');
    console.log('user que ya esta :>> ', user);
    if (!user?.userName) {
      userService.getClient().then(user => {
        console.log('user :>> ', user);
        dispatch(setUser(user ?? emptyUser));
      });
    }
  }, []);

  useEffect(() => {
    if (route.params?.entry) {
      setSelectedEntry(route.params.entry);
    } else {
      setSelectedEntry(undefined);
    }
  }, [route.params]);

  const handleEntryCreated = () => {
    console.log('handleEntryCreated');
    navigation.navigate('Main', {refresh: true});
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <EntryForm onCreatedEntry={handleEntryCreated} entry={selectedEntry} />
    </View>
  );
};

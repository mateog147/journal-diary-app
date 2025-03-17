import {useSelector} from 'react-redux';
import {RootState} from '../store';
import {api} from './config';
import {CreateEntryDto} from '../../interfaces/EntryDto';
import {IEntry} from '../../interfaces/EntryInterface';

export const EntryService = () => {
  const URL = `${api.url}/${api.entryPath}`;
  const {token} = useSelector((state: RootState) => state.token);
  return {
    createEntry: async (dto: CreateEntryDto): Promise<IEntry | undefined> => {
      try {
        const response: Response = await fetch(`${URL}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dto),
        });
        console.log(response.status);
        const data: IEntry = await response.json();
        console.log('entry data :>> ', data);
        return data;
      } catch (error) {
        console.error(error);
      }
    },
  };
};

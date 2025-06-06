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
    getClientEntriesByDate: async (
      dateString: string,
    ): Promise<IEntry[] | undefined> => {
      try {
        console.log(`Start getClientEntriesByDate date: ${dateString}`)
        const startDate = `${dateString}T00:00:00.500Z`
        const endDate = `${dateString}T23:59:59.500Z`
        const response: Response = await fetch(`${URL}/?start=${startDate}&end=${endDate}`, {
          method: 'GET',
          headers: {Authorization: `Bearer ${token}`},
        });
        console.log(response.status);
        const data: IEntry[] = await response.json();
        console.log('data entries:>> ', data);
        return data;
      } catch (error) {
        console.error(error);
      }
    },
    deleteEntry: async (entryId: string): Promise<boolean> => {
      try {
        const response: Response = await fetch(`${URL}/${entryId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        });
        console.log('Delete entry status:', response.status);
        return response.ok;
      } catch (error) {
        console.error('Error deleting entry:', error);
        return false;
      }
    },
    updateEntry: async (entryId: string, dto: CreateEntryDto): Promise<IEntry | undefined> => {
      try {
        const response: Response = await fetch(`${URL}/${entryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            title: dto.title,
            content: dto.content
          })
        });
        
        console.log('Update entry status:', response.status);
        
        if (response.ok) {
          const data: IEntry = await response.json();
          console.log('Updated entry data service:', data);
          return data;
        }
        return undefined;
      } catch (error) {
        console.error('Error updating entry:', error);
        return undefined;
      }
    },
  };
};

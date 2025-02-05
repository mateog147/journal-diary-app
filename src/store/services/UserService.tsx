import {useSelector} from 'react-redux';
import {SingupDto} from '../../interfaces/SingupDto';
import {RootState} from '../store';
import {api} from './config';
import { IUser } from '../../interfaces/UserInterface';

export const UserService = () => {
  const URL = `${api.url}/${api.userPath}`;
  const {token} = useSelector((state: RootState) => state.token);
  return {
    singUp: async (singupDto: SingupDto): Promise<string | undefined> => {
      try {
        const response: Response = await fetch(`${URL}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(singupDto),
        });
        const user = await response.json();
        console.log(response.status);
        return user;
      } catch (error) {
        console.error(`Error at user service ${error}r`);
      }
    },

    getClient: async (): Promise<IUser | undefined> => {
      try {
        const response: Response = await fetch(`${URL}`, {
          method: 'GET',
          headers: {Authorization: `Bearer ${token}`},
        });
        console.log(response.status);
        const data: IUser = await response.json();
        console.log('data :>> ', data);
        return data;
      } catch (error) {
        console.error(error);
      }
    },
  };
};

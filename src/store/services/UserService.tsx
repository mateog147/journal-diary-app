import {SingupDto} from '../../interfaces/SingupDto';
import {api} from './config';

export const UserService = () => {
  const URL = `${api.url}/${api.userPath}`;
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
  };
};

import {LoginDto} from '../../interfaces/LoginDto';
import {api} from './config';

export const AuthService = () => {
  const URL = `${api.url}/${api.authPath}`;
  console.log('URL :>> ', URL);
  return {
    login: async (loginDto: LoginDto): Promise<string | undefined> => {
      try {
        const response: Response = await fetch(`${URL}/login`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginDto),
        });
        const res = await response.json();
        console.log(response.status);
        return res['access_token'];
      } catch (error) {
        console.error(`Error at auth service ${error}r`);
      }
    },
  };
};

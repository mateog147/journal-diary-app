interface LoginData {
  email: string;
  password: string;
}

export interface UserData {
  id: string;
  email: string;
  profilePicture: string;
}

export type LoginAction =
  | {type: 'LOGIN'; input: LoginData}
  | {type: 'LOGOUT'; user: UserData};


export function loginRequest(input: LoginData): LoginAction {
  return {type: 'LOGIN', input};
}

export function loginSuccess(user: UserData): LoginAction {
  return {type: 'LOGOUT', user};
}

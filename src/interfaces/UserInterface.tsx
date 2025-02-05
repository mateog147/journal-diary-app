export interface IUser {
  userName: string;
  contactInfo: {
    email: string;
    name: string;
    lastName: string;
  };
  gender: string;
  birthDay: string;
}

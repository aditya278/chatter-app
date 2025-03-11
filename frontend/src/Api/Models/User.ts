export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  picture: string;
  token?: string;
}
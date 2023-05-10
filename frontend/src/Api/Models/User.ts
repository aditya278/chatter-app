export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  picture: string;
  token?: string;
}
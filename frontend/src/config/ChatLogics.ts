import { IUser } from "../Api/Models/User";

export const getSender = (users: IUser[], loggedUser?: IUser, fullUser = false) => {
  const user: IUser = users.find(user => user.email !== loggedUser?.email) ?? users[0];
  if (!fullUser)
    return user.name;
  return user;
}
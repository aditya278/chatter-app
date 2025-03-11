import { Request } from "express"

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  picture: string;
}

export interface CustomisedRequest extends Request {
  user?: UserInfo | null;
}
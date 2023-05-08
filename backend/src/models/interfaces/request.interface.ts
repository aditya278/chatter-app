import { Request } from "express"
import { IUserDoc } from "../user.model"

export interface CustomisedRequest extends Request {
  [x: string]: any;
  user: IUserDoc;
}
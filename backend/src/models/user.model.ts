import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IUser {
  name: string;
  email: string;
  password: string;
  picture: string;
}

interface IUserDoc extends IUser, Document {
}

interface IUserModel extends Model<IUserDoc> {
  build(attr: IUser): IUserDoc;
};

const UserSchema: Schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
    default: 'https://icon-library.com/images/141782.svg.svg'
  }
}, {
  timestamps: true
});

UserSchema.statics.build = (attr: IUser) => new User(attr);

const User = mongoose.model<IUserDoc, IUserModel>('User', UserSchema);

export default User;
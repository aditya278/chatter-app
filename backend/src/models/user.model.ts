import mongoose, { Schema, Model, Document, CallbackWithoutResultAndOptionalError } from 'mongoose';
import generateToken from '../config/generateToken';
import bcrypt from 'bcryptjs';

const BCRYPT_SALT_ROUNDS = 10;

export interface IUser {
  name: string;
  email: string;
  password: string;
  picture: string;
}

export interface IUserDoc extends IUser, Document {
  token?: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

interface IUserModel extends Model<IUserDoc> {
  build(attr: IUser): IUserDoc;
};

const UserSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

UserSchema.pre('save', async function save (next) {
  if (!this.isModified) next();

  const salt = await bcrypt.genSalt(BCRYPT_SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

UserSchema.post('save', (doc: IUserDoc, next: CallbackWithoutResultAndOptionalError) => {
  if (!doc) next();
  const { name, email, picture } = doc;
  doc.token = generateToken({ name, email, picture });
  next();
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
}

UserSchema.statics.build = (attr: IUser) => new User(attr);

const User = mongoose.model<IUserDoc, IUserModel>('User', UserSchema);

export default User;
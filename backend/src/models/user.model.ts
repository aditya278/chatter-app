import mongoose, { Schema } from 'mongoose';

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
})

export default mongoose.model('User', UserSchema);
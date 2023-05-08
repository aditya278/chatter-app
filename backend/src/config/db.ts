import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const CONNECTION_URI = process.env.MONGO_CONNECTION_URI || '';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(CONNECTION_URI);

    console.log(`Database Connected: ${conn.connection.host}`);
  }
  catch(err: any) {
    console.log(`Error while connecting DB: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

// Get the database connection string from environment variables
const NEON_CONNECTION_STRING = process.env.NEON_CONNECTION_STRING;

if (!NEON_CONNECTION_STRING) {
  console.error('NEON_CONNECTION_STRING is not defined in environment variables');
  process.exit(1);
}

// Create a SQL client with Neon
const sql = neon(NEON_CONNECTION_STRING);

// Create a Drizzle ORM instance
export const db = drizzle(sql);

// Database connection function
export const connectDB = async () => {
  try {
    // Test the connection
    await sql`SELECT 1`;
    console.log('Database Connected: PostgreSQL with Neon');
  } catch (err: any) {
    console.error(`Error while connecting DB: ${err.message}`);
    process.exit(1);
  }
};

export default connectDB; 
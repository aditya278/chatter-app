import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';
import dotenv from 'dotenv';
import path from 'path';

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
const db = drizzle(sql);

// Run migrations
async function main() {
  try {
    console.log('Running migrations...');
    await migrate(db, { migrationsFolder: path.join(__dirname, 'migrations') });
    console.log('Migrations completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
}

main(); 
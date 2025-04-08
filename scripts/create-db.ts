import { Client } from 'pg';
import 'dotenv/config';

/**
 * @description This script connects to a PostgreSQL database and creates a new database if it doesn't already exist.
 */

const dbName = 'fx-trading';

async function createDatabase() {
  const client = new Client({
    user: process.env.DB_USERNAME || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'your_password',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres', // connect to default db first
  });

  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );

    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Database "${dbName}" created`);
    } else {
      console.log(`Database "${dbName}" already exists`);
    }
  } catch (err) {
    console.error('Error creating database:', err);
  } finally {
    await client.end();
  }
}

createDatabase().catch((err) => {
  console.error('Unhandled error in createDatabase:', err);
});

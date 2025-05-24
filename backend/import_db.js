import { exec } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Setup __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Find the dump file
const dumpDir = path.join(__dirname, 'dump');
const dumpFile = path.join(dumpDir, `${process.env.DB_NAME}_dump.sql`);

if (!fs.existsSync(dumpFile)) {
  console.error(`Dump file not found: ${dumpFile}`);
  process.exit(1);
}

// Prepare psql command
const cmd = `psql -U ${process.env.DB_USER} -h ${process.env.DB_HOST} -d ${process.env.DB_NAME} -f "${dumpFile}"`;

// Run psql
console.log('Importing database...');
exec(cmd, { env: { ...process.env, PGPASSWORD: process.env.DB_PASSWORD } }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error importing database: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`psql stderr: ${stderr}`);
  }
  console.log(`Database imported from ${dumpFile}`);
});
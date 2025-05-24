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

// Ensure /dump directory exists
const dumpDir = path.join(__dirname, 'dump');
if (!fs.existsSync(dumpDir)) {
  fs.mkdirSync(dumpDir);
}

// Prepare pg_dump command
const dumpFile = path.join(dumpDir, `${process.env.DB_NAME}_dump.sql`);
const cmd = `pg_dump -U ${process.env.DB_USER} -h ${process.env.DB_HOST} -d ${process.env.DB_NAME} -F p -f "${dumpFile}"`;

// Run pg_dump
console.log('Dumping database...');
exec(cmd, { env: { ...process.env, PGPASSWORD: process.env.DB_PASSWORD } }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error dumping database: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`pg_dump stderr: ${stderr}`);
  }
  console.log(`Database dumped to ${dumpFile}`);
});
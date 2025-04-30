import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { sql_queries } from './sql_queries.js';
import { pgClient } from './postgres_db.js';
import productRoutes from './routes/productRoutes.js';
import authRoutes from './routes/authRoutes.js';
import e from 'express';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this line to handle form data

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use((req, res, next) => {
    console.log(`First middleware`);
    console.log(`Request URL: ${req.url}`);
    console.log(`Request Method: ${req.method}`);
    next();
});

// API routes first
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

// Static files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'build')));


// Catch-all route last
app.get('/{*splat}', (req, res) => {
    try {
        res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
    } catch (error) {
        console.error('Error serving index.html:', error);
        res.status(500).send('Error loading application');
    }
});

async function connectDB() {
    try {
        await pgClient.connect();
        // Execute queries sequentially
        await pgClient.query(sql_queries.createProductTableQuery);
        await pgClient.query(sql_queries.createOrderTableQuery);
        await pgClient.query(sql_queries.createUserTableQuery);
        await pgClient.query(sql_queries.createAuthTableQuery);

        console.log('Connected to the database');
        return true;
    } catch (err) {
        console.error('Error connecting to the database', err.stack);
        return false;
    }
}

// Modified server startup
connectDB().then((connected) => {
    if (!connected) {
        console.error('Server startup failed: Could not connect to database');
        process.exit(1); // Exit with error code
    }
    
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Fatal error during startup:', error);
    process.exit(1);
});
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import pg from 'pg';
import dotenv from 'dotenv';

import { sql_queries } from './sql_queries.js';
import { pgClient } from './postgres_db.js';
import productRoutes from './routes/productRoutes.js';

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // for cross-origin resource sharing
app.use(morgan('dev'));// for logging requests
app.use(helmet()); // for security headers
app.use(express.json()); // for parsing application/json

app.use('/api/products', productRoutes); // for product routes


async function connectDB() {
    try {
        await pgClient.connect();
        await pgClient.query(sql_queries.createProductTableQuery);
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
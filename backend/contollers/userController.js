import { sql_queries } from '../sql_queries.js';
import { pgClient } from '../postgres_db.js';

export const getUsers = async (req, res) => {
    try {
        const result = await pgClient.query(sql_queries.getUsersQuery);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
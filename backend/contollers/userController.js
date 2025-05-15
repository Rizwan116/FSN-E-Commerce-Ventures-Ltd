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

export const getUserById = async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pgClient.query(sql_queries.getUserByIdQuery, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const getReviewsByUserId = async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pgClient.query(sql_queries.getReviewsByUserIdQuery, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reviews not found' });
        }
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

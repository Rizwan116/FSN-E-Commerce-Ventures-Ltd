import { sql_queries } from '../sql_queries.js';
import { pgClient } from '../postgres_db.js';

export const getOrders = async (req, res) => {
    try {
        const result = await pgClient.query(sql_queries.getOrdersQuery);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
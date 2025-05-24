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

export const getOrdersByUserId = async (req, res) => {
    const userId = req.params.id;
    try {
        const result = await pgClient.query(sql_queries.getOrdersByUserIdQuery, [userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Orders not found' });
        }
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const getOrderById = async (req, res) => {
    const orderId = req.params.id;
    try {
        const result = await pgClient.query(sql_queries.getOrderByIdQuery, [orderId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const createOrder = async (req, res) => {
    const { user_id, product_id, quantity, total_price, address } = req.body;
    try {
        const result = await pgClient.query(sql_queries.createOrderQuery, [ user_id, product_id, quantity, total_price, address]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const updateOrder = async (req, res) => {
    const orderId = req.params.id;
    const { product_id, quantity, total_price, address} = req.body;
    try {
        const result = await pgClient.query(sql_queries.updateOrderQuery, [product_id, quantity, total_price, address, orderId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export const cancelOrder = async (req, res) => {
    const orderId = req.params.id;
    try {
        const result = await pgClient.query(sql_queries.cancelOrderQuery, [orderId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


export const getOrdersByProductId = async (req, res) => {
    const productId = req.params.id;
    try {
        const result = await pgClient.query(sql_queries.getOrdersByProductIdQuery, [productId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Orders not found' });
        }
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
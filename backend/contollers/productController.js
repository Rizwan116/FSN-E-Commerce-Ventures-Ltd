import { sql_queries } from '../sql_queries.js';
import { pgClient } from '../postgres_db.js';

export const getProducts = async (req, res) => {
     try {
        const result = await pgClient.query(sql_queries.getProductsQuery);
        const products = result.rows;
          res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            products,
        });
   } catch (error) {
       console.error('Error fetching products:', error);
       res.status(500).json({
           success: false,
           message: 'Error fetching products',
           error: error.message,
       });
   }
}

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pgClient.query(sql_queries.getProductByIdQuery, [id]);
    const product = result.rows[0];

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Product with id ${id} fetched successfully`,
      product,
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message,
    });
  }
}
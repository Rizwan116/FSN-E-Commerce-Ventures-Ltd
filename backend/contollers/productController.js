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

export const createProduct = async (req, res) => {
  const { name, description, price, image_url, category, is_available } = req.body;

  if (!name || !description || !price || !image_url || !category || !is_available) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  try {
    const result = await pgClient.query(sql_queries.createProductQuery, [name, description, price, image_url, category, is_available]);
    const newProduct = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product: newProduct,
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message,
    });
  }
}

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url, category, is_available } = req.body;

  if (!name || !description || !price || !image_url || !category || !is_available) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  try {
    const result = await pgClient.query(sql_queries.updateProductQuery, [name, description, price, image_url, category, is_available, id]);
    const updatedProduct = result.rows[0];

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message,
    });
  }
}

export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pgClient.query(sql_queries.deleteProductQuery, [id]);
    const deletedProduct = result.rows[0];

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: `Product with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      product: deletedProduct,
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message,
    });
  }
}
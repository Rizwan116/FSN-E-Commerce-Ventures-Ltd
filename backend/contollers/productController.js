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

export const getAllProducts = async (req, res) => {
     try {
        const result = await pgClient.query(sql_queries.getAllProductsQuery);
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
  const { name, description, price, image_url, category, is_available, product_urls } = req.body;

  if (!name || !description || !price || !image_url || !category || !is_available) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  if (!product_urls || product_urls.length === 0) {
    product_urls = null;
  }

  try {
    const result = await pgClient.query(sql_queries.createProductQuery, [name, description, price, image_url, category, is_available, product_urls]);
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
  const { name, description, price, image_url, category, is_available, product_urls } = req.body;

  if (!name || !description || !price || !image_url || !category || !is_available) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  if (!product_urls || product_urls.length === 0) {
    product_urls = null;
  }

  try {
    const result = await pgClient.query(sql_queries.updateProductQuery, [name, description, price, image_url, category, is_available, product_urls, id]);
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

export const getProductReviews = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pgClient.query(sql_queries.getReviewsByProductIdQuery, [id]);
    const reviews = result.rows;

    if (!reviews) {
      return res.status(404).json({
        success: false,
        message: `No reviews found for product with id ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Reviews for product with id ${id} fetched successfully`,
      reviews,
    });
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product reviews',
      error: error.message,
    });
  }
}

export const createProductReview = async (req, res) => {
  const { id } = req.params;
  const { user_id, rating, comment, order_id, product_id } = req.body;

  if (!user_id || !rating || !comment || !order_id || !product_id) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }
  try {

    // Check if the user has already reviewed the product
    const existingReview = await pgClient.query(sql_queries.getReviewByProductIdAndUserIdQuery, [product_id, user_id]);
    if (existingReview.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User has already reviewed this product',
      });
    }
    // Check if the user has purchased the product
    const purchasedProduct = await pgClient.query(sql_queries.getOrderByUserIdAndProductIdQuery, [user_id, product_id]);
    if (purchasedProduct.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User has not purchased this product',
      });
    }

    const result = await pgClient.query(sql_queries.createProductReviewQuery, [product_id, user_id, rating, comment, order_id]);
    const newReview = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Product review created successfully',
      review: newReview,
    });
  } catch (error) {
    console.error('Error creating product review:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product review',
      error: error.message,
    });
  }
}

export const updateProductReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  if (!rating || !comment) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required',
    });
  }

  try {
    const result = await pgClient.query(sql_queries.updateReviewQuery, [rating, comment, id]);
    const updatedReview = result.rows[0];

    if (!updatedReview) {
      return res.status(404).json({
        success: false,
        message: `Review with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product review updated successfully',
      review: updatedReview,
    });
  } catch (error) {
    console.error('Error updating product review:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product review',
      error: error.message,
    });
  }
}

export const deleteProductReview = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pgClient.query(sql_queries.deleteReviewQuery, [id]);
    const deletedReview = result.rows[0];

    if (!deletedReview) {
      return res.status(404).json({
        success: false,
        message: `Review with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product review deleted successfully',
      review: deletedReview,
    });
  } catch (error) {
    console.error('Error deleting product review:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product review',
      error: error.message,
    });
  }
}

// export const getProductByCategory = async (req, res) => {
//   const { category } = req.params;
//   try {
//     const result = await pgClient.query(sql_queries.getProductByCategoryQuery, [category]);
//     const products = result.rows;

//     if (!products) {
//       return res.status(404).json({
//         success: false,
//         message: `No products found for category ${category}`,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: `Products for category ${category} fetched successfully`,
//       products,
//     });
//   } catch (error) {
//     console.error('Error fetching products by category:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching products by category',
//       error: error.message,
//     });
//   }
// }

export const getReviewById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pgClient.query(sql_queries.getReviewByIdQuery, [id]);
    const review = result.rows[0];

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `Review with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Review with id ${id} fetched successfully`,
      review,
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message,
    });
  }
};

export const getReviewByProductId = async (req, res) => {
  const { productId } = req.params;
  try {
    const result = await pgClient.query(sql_queries.getReviewsByProductIdQuery, [productId]);
    const review = result.rows[0];

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `Review with id ${id} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Review with id ${id} fetched successfully`,
      review,
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message,
    });
  }
}

export const getReviewByProductIdAndUserId = async (req, res) => {
  const { productId, userId } = req.params;
  try {
    const result = await pgClient.query(
      sql_queries.getReviewByProductIdAndUserIdQuery,
      [productId, userId]
    );
    const review = result.rows[0];

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `Review for product ${productId} by user ${userId} not found`,
      });
    }

    res.status(200).json({
      success: true,
      message: `Review for product ${productId} by user ${userId} fetched successfully`,
      review,
    });
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message,
    });
  }
}
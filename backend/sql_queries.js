const createProductTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP DEFAULT NULL,
        is_deleted BOOLEAN DEFAULT FALSE,
        is_available BOOLEAN DEFAULT TRUE
    );
`;

const createOrderTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        quantity INTEGER NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        address TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        firstName VARCHAR(255) NOT NULL,
        lastName VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255),
        phone VARCHAR(15) UNIQUE CHECK (phone IS NULL OR phone != ''),
        profile_image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createAuthTableQuery = `
    CREATE TABLE IF NOT EXISTS auth (
        id SERIAL PRIMARY KEY,
        auth_token VARCHAR(255) NOT NULL,
        user_id INTEGER REFERENCES users(id),
        expires_at TIMESTAMP NOT NULL,
        is_valid BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createReviewTableQuery = `
    CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        user_firstname VARCHAR(255),
        user_lastname VARCHAR(255),
        user_profile_image VARCHAR(255),
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createUserQuery = `
    INSERT INTO users (firstName, lastName, email, password, phone)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, phone, firstName, lastName, profile_image;
`;

const checkUserQuery = `
    SELECT id, email, phone, firstName, lastName, profile_image 
    FROM users 
    WHERE email = $1 AND password = $2;
`;

const resetPasswordQuery = `
    UPDATE users SET password = $1 WHERE (email = $2 AND password = $3)
    RETURNING id, email, phone, firstName, lastName, profile_image;
`;

const getProductsQuery = `
    SELECT id, name, description, price, image, category, reviews_count, reviews_rating, created_at, updated_at, is_available
    FROM products
    WHERE is_available = TRUE
    AND is_deleted = FALSE
`;

const getProductByIdQuery = `
    SELECT id, name, description, price, image, category, reviews_count, reviews_rating, created_at, updated_at, is_available
    FROM products
    WHERE id = $1
    AND is_deleted = FALSE
`;

const getOrdersQuery = `
    SELECT id, product_id, quantity, total_price, address, created_at, updated_at
    FROM orders;
`;

const getUsersQuery = `
    SELECT id, firstName, lastName, email, phone, profile_image, created_at, updated_at 
    FROM users;
`;

const createProductQuery = `
    INSERT INTO products (name, description, price, image, category, is_available)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, name, description, price, image, category, is_available, created_at, updated_at;
`;

const updateProductQuery = `
    UPDATE products SET name = $1, description = $2, price = $3, image = $4, category = $5, is_available = $6
    WHERE id = $7
    RETURNING id, name, description, price, image, category, reviews_count, reviews_rating, created_at, updated_at, is_available, is_deleted, deleted_at;
`;

const deleteProductQuery = `
    SET is_deleted = TRUE AND updated_at = CURRENT_TIMESTAMP AND deleted_at = CURRENT_TIMESTAMP WHERE id = $1
    RETURNING id, name, description, price, image, category, reviews_count, reviews_rating, created_at, updated_at, is_available, is_deleted, deleted_at;
`;

const getUserByEmailQuery = `
  SELECT * FROM users WHERE email = $1;
`;

const createGoogleUserQuery = `
   INSERT INTO users (firstname, lastname, email, profile_image)
   VALUES ($1, $2, $3, $4)
   RETURNING *;
`;

const findOrCreateGoogleUserQuery = `
   INSERT INTO users (firstname, lastname, email, profile_image)
   VALUES ($1, $2, $3, $4)
   ON CONFLICT (email)
   DO UPDATE SET profile_image = EXCLUDED.profile_image
   RETURNING *;
`;

const getUserByIdQuery = `
    SELECT id, firstName, lastName, email, phone, profile_image, created_at, updated_at 
    FROM users
    WHERE id = $1;
`;

const getOrdersbyUserIdQuery = `
    SELECT id, product_id, quantity, total_price, address, created_at, updated_at
    FROM orders
    WHERE user_id = $1;
`;

const getOrderByUserIdAndProductIdQuery = `
    SELECT id, product_id, quantity, total_price, address, created_at, updated_at
    FROM orders
    WHERE user_id = $1 AND product_id = $2;
`;

const getOrderbyIdQuery = `
    SELECT id, product_id, quantity, total_price, address, created_at, updated_at
    FROM orders
    WHERE id = $1;
`;

const createOrderQuery = `
    INSERT INTO orders (user_id, product_id, quantity, total_price, address)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, address, user_id, product_id, quantity, total_price, created_at, updated_at;
`;

const updateOrderQuery = `
    UPDATE orders SET product_id = $1, quantity = $2, total_price = $3, address = $4
    WHERE id = $5
    RETURNING id, product_id, quantity, total_price, address, created_at, updated_at;
`;

const deleteOrderQuery = `
    DELETE FROM orders
    WHERE id = $1
    RETURNING id, address, user_id, product_id, quantity, total_price, created_at, updated_at;
`;

const getReviewsByProductIdQuery = `
    SELECT id, product_id, user_id, user_firstname, user_lastname, user_profile_image, rating, comment, created_at, updated_at
    FROM reviews
    WHERE product_id = $1;
`;

const createReviewQuery = `
    INSERT INTO reviews (product_id, user_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING id, product_id, user_id, rating, comment, created_at, updated_at;
`;

const updateReviewQuery = `
    UPDATE reviews SET rating = $1, comment = $2
    WHERE id = $3
    RETURNING id, product_id, user_id, rating, comment, created_at, updated_at;
`;

const deleteReviewQuery = `
    DELETE FROM reviews
    WHERE id = $1
    RETURNING id, product_id, user_id, rating, comment, created_at, updated_at;
`;

const getReviewsByUserIdQuery = `
    SELECT id, product_id, user_id, user_firstname, user_lastname, user_profile_image, rating, comment, created_at, updated_at
    FROM reviews
    WHERE user_id = $1;
`;

const getReviewByIdQuery = `
    SELECT id, product_id, user_id, user_firstname, user_lastname, user_profile_image, rating, comment, created_at, updated_at
    FROM reviews
    WHERE id = $1;
`;

const getReviewByProductIdAndUserIdQuery = `
    SELECT id, product_id, user_id, user_firstname, user_lastname, user_profile_image, rating, comment, created_at, updated_at
    FROM reviews
    WHERE product_id = $1 AND user_id = $2;
`;

const getOrdersByProductIdQuery = `
    SELECT id, product_id, user_id, quantity, total_price, address, created_at, updated_at
    FROM orders
    WHERE product_id = $1;
`;

export const sql_queries = {
    createProductTableQuery,
    createOrderTableQuery,
    createUserTableQuery,
    createAuthTableQuery,
    createReviewTableQuery,
    createUserQuery,
    checkUserQuery,
    resetPasswordQuery,
    getProductsQuery,
    getProductByIdQuery,
    getOrdersQuery,
    getUsersQuery,
    createProductQuery,
    updateProductQuery,
    deleteProductQuery,
    findOrCreateGoogleUserQuery,
    createGoogleUserQuery,
    getUserByEmailQuery,
    getUserByIdQuery,
    getOrderByUserIdAndProductIdQuery,
    getOrdersbyUserIdQuery,
    getOrderbyIdQuery,
    createOrderQuery,
    updateOrderQuery,
    deleteOrderQuery,
    getReviewsByProductIdQuery,
    createReviewQuery,
    updateReviewQuery,
    deleteReviewQuery,
    getReviewsByUserIdQuery,
    getReviewByIdQuery,
    getReviewByProductIdAndUserIdQuery,
    getOrdersByProductIdQuery,
};

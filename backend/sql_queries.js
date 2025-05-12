const createProductTableQuery = `
    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL,
        reviews_count INTEGER DEFAULT 0,
        reviews_rating DECIMAL(3, 2) DEFAULT 0,
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
        password VARCHAR(255) NOT NULL,
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
    SELECT id, product_id, quantity, total_price, created_at, updated_at 
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
export const sql_queries = {
    createProductTableQuery: createProductTableQuery,
    createOrderTableQuery: createOrderTableQuery,
    createUserTableQuery: createUserTableQuery,
    createAuthTableQuery: createAuthTableQuery,
    createUserQuery: createUserQuery,
    checkUserQuery: checkUserQuery,
    resetPasswordQuery: resetPasswordQuery,
    getProductsQuery: getProductsQuery,
    getProductByIdQuery: getProductByIdQuery,
    getOrdersQuery: getOrdersQuery,
    getUsersQuery: getUsersQuery,
    createProductQuery: createProductQuery,
    updateProductQuery: updateProductQuery,
    deleteProductQuery: deleteProductQuery,
};
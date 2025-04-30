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
    is_available BOOLEAN DEFAULT TRUE,
    );
`;

const createOrderTableQuery = `
    CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
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
    INSERT INTO users (first_name, last_name, email, password, phone)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
`;

export const sql_queries = {
    createProductTableQuery: createProductTableQuery,
    createOrderTableQuery: createOrderTableQuery,
    createUserTableQuery: createUserTableQuery,
    createAuthTableQuery: createAuthTableQuery,
    createUserQuery: createUserQuery,
};
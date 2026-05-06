-- PostgreSQL init script
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS restaurants (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cuisine VARCHAR(100),
    rating DECIMAL(2,1) DEFAULT 0,
    delivery_time INTEGER,
    cost_for_two INTEGER,
    is_open BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    is_promoted BOOLEAN DEFAULT false,
    locality VARCHAR(255),
    city VARCHAR(100),
    lat DECIMAL(10,8),
    lng DECIMAL(11,8),
    images TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS menu_items (
    id VARCHAR(36) PRIMARY KEY,
    restaurant_id VARCHAR(36) REFERENCES restaurants(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    category VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) REFERENCES users(id),
    restaurant_id VARCHAR(36) REFERENCES restaurants(id),
    total_amount DECIMAL(10,2) NOT NULL,
    delivery_address TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(36) PRIMARY KEY,
    order_id VARCHAR(36) REFERENCES orders(id),
    menu_item_id VARCHAR(36) REFERENCES menu_items(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL
);

-- Insert sample data
INSERT INTO restaurants (id, name, cuisine, rating, delivery_time, cost_for_two, is_open, locality, city, lat, lng)
VALUES 
('rest-001', 'The Great Indian Kitchen', 'North Indian', 4.5, 30, 400, true, 'Koramangala', 'Bangalore', 12.934, 77.612),
('rest-002', 'Pizza Palace', 'Italian', 4.2, 25, 600, true, 'Indiranagar', 'Bangalore', 12.978, 77.641),
('rest-003', 'Sushi World', 'Japanese', 4.7, 35, 1200, true, 'MG Road', 'Bangalore', 12.976, 77.599);

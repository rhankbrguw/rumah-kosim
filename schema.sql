CREATE DATABASE IF NOT EXISTS rumah_kosim;
USE rumah_kosim;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role ENUM('user', 'admin') DEFAULT 'user',
    address TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    otp VARCHAR(10),
    otp_expires_at DATETIME,
    reset_token VARCHAR(255),
    reset_expires_at DATETIME
);

CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS cart (
    user_id INT,
    product_id INT,
    quantity INT DEFAULT 1,
    PRIMARY KEY (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    shipping_price DECIMAL(10, 2) NOT NULL,
    shipping_method VARCHAR(255) NOT NULL,
    tracking_number VARCHAR(255),
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'Processing',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price_at_time DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    user_id INT,
    rating INT NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- Insert 8 books
INSERT INTO products (title, price, image, description, quantity) VALUES 
('Atomic Habits', 145000, '/images/buku1.jpg', 'Tiny Changes, Remarkable Results. An Easy & Proven Way to Build Good Habits & Break Bad Ones by James Clear.', 100),
('Deep Work', 125000, '/images/buku2.jpg', 'Rules for Focused Success in a Distracted World by Cal Newport.', 50),
('Sapiens', 165000, '/images/buku3.jpg', 'A Brief History of Humankind by Yuval Noah Harari.', 200),
('Range', 135000, '/images/buku4.jpg', 'Why Generalists Triumph in a Specialized World by David Epstein.', 150),
('AI and Machine Learning for Coders', 450000, '/images/buku5.jpg', 'A Programmer''s Guide to Artificial Intelligence by Laurence Moroney.', 120),
('The Psychology of Money', 115000, '/images/buku6.jpg', 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.', 180),
('Web Scalability for Startup Engineers', 480000, '/images/buku7.jpg', 'Tips & Techniques for Scaling Your Web Application by Artur Ejsmont.', 90),
('Breath', 138000, '/images/buku8.jpg', 'The New Science of a Lost Art by James Nestor.', 110);

DELIMITER //
CREATE PROCEDURE IF NOT EXISTS add_to_cart(IN p_user_id INT, IN p_product_id INT, IN p_quantity INT)
BEGIN
    DECLARE v_stock INT;
    SELECT quantity INTO v_stock FROM products WHERE id = p_product_id;
    IF v_stock < p_quantity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Insufficient stock';
    ELSE
        INSERT INTO cart (user_id, product_id, quantity) 
        VALUES (p_user_id, p_product_id, p_quantity)
        ON DUPLICATE KEY UPDATE quantity = quantity + p_quantity;
        
        UPDATE products SET quantity = quantity - p_quantity WHERE id = p_product_id;
    END IF;
END //
DELIMITER ;

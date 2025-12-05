-- MySQL schema and sample data for School Canteen Ordering System

CREATE DATABASE IF NOT EXISTS canteen_db;
USE canteen_db;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS menu_items;

CREATE TABLE menu_items (
  item_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  category VARCHAR(50),
  description TEXT,
  available TINYINT(1) DEFAULT 1
);

CREATE TABLE customers (
  customer_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(25),
  year_section VARCHAR(100)
);

CREATE TABLE orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(customer_id) ON DELETE SET NULL
);

CREATE TABLE order_items (
  order_item_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  item_id INT,
  quantity INT NOT NULL,
  price DECIMAL(8,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (item_id) REFERENCES menu_items(item_id) ON DELETE RESTRICT
);

-- sample menu
INSERT INTO menu_items (name, price, category, description) VALUES
('Pandesal + Egg', 25.00, 'Breakfast', 'Classic pandesal with egg'),
('Chicken Sandwich', 35.00, 'Sandwich', 'Grilled chicken with lettuce'),
('Milk Tea', 30.00, 'Beverage', 'Flavors: Okinawa, Wintermelon, Cookies & Cream, Dark Choco, Matcha'),
('Banana', 15.00, 'Snack', 'Fresh banana'),
('Burger Meal', 60.00, 'Meal', 'Burger with fries and drink');

-- sample customer
INSERT INTO customers (name, email, phone, year_section) VALUES
('Test Student', 'student@example.com', '09171234567', 'Grade 10 - Rose');

-- sample order
INSERT INTO orders (customer_id, total_amount, status) VALUES (1, 80.00, 'Completed');
INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (1, 1, 1, 35.00), (1, 3, 1, 45.00);


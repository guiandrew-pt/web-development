CREATE DATABASE review;

CREATE TABLE Customers (
    id int,
    first_name varchar(255),
    last_name varchar(255),
    address varchar(255)
);

INSERT INTO Customers (id, first_name, last_name, address)
VALUES (1, 'John', 'Doe', '32 Cherry Blvd');

INSERT INTO Customers (id, first_name, last_name, address)
VALUES (2, 'Maria', 'Nita', '12 Sunset Drive');

SELECT * FROM Customers;

CREATE TABLE products (
	id INT NOT NULL,
    name STRING,
    Price MONEY,
    PRIMARY KEY (id)
);

INSERT INTO products
VALUES (1, 'Pen', 1.20);

INSERT INTO products (id, name)
VALUES (2, 'Pencil');

SELECT * FROM products 
WHERE id = 1;

UPDATE products 
SET price = 0.80
WHERE id = 2;

ALTER TABLE products
ADD stock INT;

UPDATE products 
SET stock = 32
WHERE id = 1;

UPDATE products 
SET stock = 12
WHERE id = 2;

DELETE FROM products
WHERE id = 2;

INSERT INTO products (id, name, price, stock)
VALUES (2, 'Pencil', 0.80, 12);

CREATE TABLE orders (
    id INT NOT NULL,
    order_number INT,
    customer_id INT,
    product_id INT,
    PRIMARY KEY (id),
    FOREIGN KEY (customer_id) REFERENCES customers(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

INSERT INTO orders 
VALUES (1, 4362, 2, 1);

SELECT orders.order_number, customers.first_name, customers.last_name, customers.address
FROM orders
INNER JOIN customers ON orders.customer_id = customers.id;

SELECT orders.order_number, products.name, products.price, products.stock
FROM orders
INNER JOIN products ON orders.product_id = products.id;

CREATE TABLE friends (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    age INT,
    is_cool BOOLEAN
);

CREATE TABLE capitals (
    id SERIAL PRIMARY KEY,
    country VARCHAR(45),
    capital VARCHAR(45)
);

CREATE TABLE flags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(45),
    flag text
);

CREATE TABLE world_food (
    id SERIAL PRIMARY KEY,
    country VARCHAR(45),
    rice_production FLOAT,
    wheat_production FLOAT
);

SELECT  FROM world_food;

SELECT country FROM world_food;

SELECT rice_production 
FROM world_food
WHERE country = 'United States';

SELECT country 
FROM world_food
WHERE wheat_production > 20;

SELECT country 
FROM world_food
WHERE country LIKE 'U' || '%';

SELECT country 
FROM world_food
WHERE country LIKE '%' || 'a';

CREATE TABLE visited_countries(
    id SERIAL PRIMARY KEY,
    country_code CHAR(2) NOT NULL UNIQUE
);

INSERT INTO world_food (country, rice_production, wheat_production)
VALUES ('Italy', 1.46, 7.3);

CREATE TABLE countries(
    id SERIAL PRIMARY KEY,
    country_code CHAR(2),
    country_name VARCHAR(100)
);

UPDATE users SET name = 'Albert' WHERE id = 2;

ALTER TABLE visited_countries
    ADD UNIQUE(user_id, country_code);

DROP TABLE visited_countries;

DROP TABLE IF EXISTS visited_countries;

SELECT * 
FROM users
ORDER BY id ASC;

SELECT * 
FROM users
ORDER BY id DESC;

DELETE FROM visited_countries
WHERE id = 16;

DELETE FROM visited_countries
WHERE id = 16 AND country_code = 'AU';

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100)
);

INSERT INTO users (email, password) 
VALUES ('lee@gmail.com', '123456');

INSERT INTO users (email, password) 
VALUES ('jim@gmail.com', 'asewdf');

SELECT * FROM public.users
ORDER BY id ASC 

ALTER TABLE users
    ALTER COLUMN email SET NOT NULL;

ALTER TABLE users ADD COLUMN secret TEXT;

CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100),
    author VARCHAR(100),
    description VARCHAR(150),
    rating INT,
    isbn VARCHAR(50),
    imagePath VARCHAR(100),
    timeStamp TIMESTAMP
);

CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    note VARCHAR(255),
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES books(id)
);

ALTER TABLE table_name RENAME COLUMN old_name TO new_name;

ALTER TABLE books RENAME COLUMN timeStamp TO date_when_read;

ALTER TABLE table1 ALTER COLUMN column1 TYPE text;

ALTER TABLE books ALTER COLUMN description TYPE TEXT;

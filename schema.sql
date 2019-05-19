CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  product_id INTEGER NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(20) NOT NULL,
  price DECIMAL(15,2) NOT NULL,
  stock_quantity INTEGER (15) NOT NULL ,
  product_sale DECIMAL(15,2) NOT NULL DEFAULT 0,
   PRIMARY KEY (product_id)
);

INSERT INTO products (product_name,department_name,price,stock_quantity,product_sale) 
values ('Iphone', 'Electronic', 300.25, 427,900.75);

INSERT INTO products (product_name,department_name,price,stock_quantity) 
values ('Android', 'Electronic', 500.45, 100);

INSERT INTO products (product_name,department_name,price,stock_quantity) 
values ('Iphone Power Cord', 'Electronic', 25.75, 30);

INSERT INTO products (product_name,department_name,price,stock_quantity) 
values ('T-shirts', 'Clothing', 19.99, 82);

INSERT INTO products (product_name,department_name,price,stock_quantity) 
values ('Pants', 'Clothing', 25.99, 90);

INSERT INTO products (product_name,department_name,price,stock_quantity) 
values ('Tops', 'Clothing', 12.99, 134);

INSERT INTO products (product_name,department_name,price,stock_quantity) 
values ('Pots', 'Kitchen', 50.99, 43);

INSERT INTO products (product_name,department_name,price,stock_quantity) 
values ('Oven Mittens', 'Kitchen', 5.99, 30);

INSERT INTO products (product_name,department_name,price,stock_quantity) 
values ('Duplo Fire Truck', 'Toys', 29.99, 12);

INSERT INTO products (product_name,department_name,price,stock_quantity) 
values ('Bouncy Ball', 'Clothing', 22.99, 10);

USE bamazon;
SELECT * FROM products;

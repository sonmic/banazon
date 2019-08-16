DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
item_id integer not null auto_increment,

product_name VARCHAR(100) not NULL,

department_name VARCHAR(100) not NULL,

price INT not NULL,

stock_quantity INT not NULL,
primary key (item_id)
);
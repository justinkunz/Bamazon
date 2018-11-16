drop database if exists bamazon;

create database bamazon;

create table products (
	item_id int not null auto_increment,
    product_name varchar(45) not null,
    department_name varchar(45) not null,
    price decimal not null,
    stock_quanity int not null,
    primary key(item_id)
);

insert into tables(product_name, department_name, price, stock_quanity)
values
('Blanket', 'Household', 19.99, 6), 
('shoes', 'Apparel', 34.89, 4),
('Laptop', 'Technology', 789.99, 2),
('Paper Towels','Household', 8.99, 12),
('Charging Cable','Technology', 14.89, 30),
('Surge Protector','Technology', 22.99, 7),
('Cat Food', 'Pet Care', 23.99, 4),
('Sunglasses', 'Apparel', 19.99, 4),
('Flea Medicine', 'Pet Care', 44.99, 3),
('TV', 'Technology', 239.99, 6);

select * from products;


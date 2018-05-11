insert into pizzas (name, toppings) values
('jerrycheese', 'tomato,cheese,sausage');

insert into customers (firstname, lastname, favorite_pizza) values
('john', 'snow', 1);



/* USERS */
insert into roles (name) values ('ADMIN'), ('USER');

insert into users (username, firstname, lastname, email, password) values
('%dbuser%', 'John', 'Doe', 'john.doe@gmail.com', crypt('%dbpasswd%', gen_salt('bf', 8)));

insert into users_roles (user_id, role_id) values (1, 1), (1, 2);

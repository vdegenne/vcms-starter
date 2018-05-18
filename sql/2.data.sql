/* SAMPLE */
insert into pizzas (name, toppings) values
('jerrycheese', 'tomato,cheese,sausage');

insert into customers (firstname, lastname, favorite_pizza) values
('john', 'snow', 1);
/* END SAMPLE */



/* USERS */
insert into roles (name) values
('ADMIN'),
('USER'),
('TEST');

CREATE EXTENSION pgcrypto;

insert into users (username, firstname, lastname, email, password) values
/* don't insert the default admin here unless you encrypt the password.
 * Instead use the snakeoil for the test, and insert the default admin by hand
 * in the database */
('snakeoil', 'Snake', 'Oil', 'snake.oil@gmail.com', crypt('password', gen_salt('md5')));


insert into users_roles (user_id, role_id) values (1, 3);
/* END USERS */
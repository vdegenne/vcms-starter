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

insert into users (username, firstname, lastname, email, password) values
/* don't insert the default admin here unless you encrypt the password. */
('snakeoil', 'Snake', 'Oil', 'snake.oil@gmail.com', '$1$CaHOH23G$5EoD0d5UDupl3GtUa93X71');

insert into users_roles (user_id, role_id) values (1, 3);
/* END USERS */

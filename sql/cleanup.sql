/* empty the table */
delete from pizzas;
delete from customers;
delete from users;
delete from roles;


/* reset the sequences */
alter sequence pizzas_id_seq restart 1;
alter sequence customers_id_seq restart 1;
alter sequence roles_id_seq restart 1;
alter sequence users_id_seq restart 1;

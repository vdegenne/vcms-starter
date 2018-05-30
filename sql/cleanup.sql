/**
 * This file is used for the tests. It will clean all the different table.
 * It should be called with 2.data to refill the tables with the initial values.
 * Another solution is to use "0.destroy.sql", "1.pre-data.sql", "2.data" and "3.post-data.sql".
 * But this approach may be slower because it contains more statements to process.
 */

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

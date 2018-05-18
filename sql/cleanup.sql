/**
 * TODO: its purpose is to be used in the application
 * testing units to clean the data before using "2.data.sql"
 * to fill it with initial data.
 */

/* SAMPLE */
drop table if exists customers cascade;
drop table if exists pizzas cascade;
/* END SAMPLE */


/* USERS */
drop table if exists users_roles cascade;
drop table if exists users cascade;
drop table if exists roles cascade;
/* END USERS */

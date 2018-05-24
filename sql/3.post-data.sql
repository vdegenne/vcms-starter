/* This file shouldn't normally be called if the `psql` command was called
 * with the proper user because then the owner of the created objects
 * in the database will be the same as the user provided with `-U`
 */


/* SAMPLE */
alter table pizzas owner to %dbuser%;
alter table customers owner to %dbuser%;
/* END SAMPLE */


/* USERS */
alter table users owner to %dbuser%;
alter table roles owner to %dbuser%;
alter table users_roles owner to %dbuser%;
/* END USERS */

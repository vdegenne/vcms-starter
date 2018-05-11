alter table pizzas owner to %dbuser%;
alter table customers owner to %dbuser%;

/* USERS */
alter table users owner to %dbuser%;
alter table roles owner to %dbuser%;
alter table users_roles owner to %dbuser%;

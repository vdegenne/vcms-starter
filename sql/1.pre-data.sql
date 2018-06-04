/* USERS */
create table users (
  id serial primary key,
  username varchar(25) not null,
  firstname varchar(50) not null,
  lastname varchar(50) not null,
  email varchar(100) not null,
  password text not null
);

create table roles (
  id serial primary key,
  name varchar(10) not null
);

create table users_roles (
  user_id integer references users(id) on delete cascade on update cascade NOT NULL,
  role_id integer references roles(id) on delete cascade on update cascade NOT NULL,
  unique(user_id, role_id)
);
/* END USERS */


/* SAMPLE */
create table pizzas (
  id serial primary key,
  name varchar(50) not null,
  toppings varchar(100) not null
);

create table customers (
  id serial primary key,
  firstname varchar(50) not null,
  lastname varchar(50) not null,
  favorite_pizza integer references pizzas (id) on update cascade on delete cascade,
  unique(firstname, lastname)
);
/* END SAMPLE */

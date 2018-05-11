CREATE ROLE %dbuser% WITH PASSWORD '%dbpasswd%' LOGIN;
CREATE DATABASE %dbname% OWNER %dbuser%;

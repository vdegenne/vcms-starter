/* The role should be created by hand
 * and the password not to be exposed in files */


DROP DATABASE IF EXISTS %dbname%;
CREATE DATABASE %dbname% OWNER %dbuser%;

\connect %dbname%


\i sql/1.structure.sql
\i sql/2.data.sql
/* \i sql/3.post-data.sql */

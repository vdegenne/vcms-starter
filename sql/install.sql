/* We should create the database and the user by hand to be sure to have the right starting configuration.
 * Here is a typical case :
 * - postgres create the role and the database for the project
 * - postgres grants the user to manipulate the database.
 * - postgres add the appropriate extensions, for instance :
 *      CREATE EXTENSION IF NOT EXISTS pgcrypto;
 **/

\set ON_ERROR_STOP on

SET client_encoding = 'UTF8';
SET default_with_oids = false;


\i sql/0.destroy.sql
\i sql/1.pre-data.sql
\i sql/2.data.sql
\i sql/3.post-data.sql

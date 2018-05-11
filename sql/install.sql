\i sql/uninstall.sql

\i sql/pre-install.sql
\connect %dbname%

create extension pgcrypto;


\i sql/structure.sql
\i sql/data.sql
\i sql/post-data.sql

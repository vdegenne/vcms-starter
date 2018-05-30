/**
 * Currently the "1.pre-data.sql" file includes constrains and other depending objects.
 * This file should be used to include the constrains and dependencies.
 * It is particularly needed when dumping backups from the database as the tuples are not always
 * in the right orders and may reference a none-existent foreign row which results in a fail.
 */

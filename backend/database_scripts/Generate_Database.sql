create database if not exists AuthUsersDB;
alter database
    AuthUsersDB
    character set = utf8mb4
    collate = utf8mb4_unicode_ci;

drop table if exists AuthUsersDB.users;

create database if not exists AuthUsersDB;
alter database
    AuthUsersDB
    character set = utf8mb4
    collate = utf8mb4_unicode_ci;
drop table if exists AuthUsersDB.users;
drop table if exists AuthUsersDB.email_validation;
drop table if exists AuthUsersDB.ip_based_lock_tracks;
drop table if exists AuthUsersDB.user_based_lock_tracks;

create table AuthUsersDB.users
(
	id integer primary key,
	generated_at date,
	email varchar(100),
	encrypted_password varchar(100),
	name varchar(100),
	midname varchar(100),
	surname varchar(100),
	gender_id integer,
	birthday date,
	phone varchar(100),
	ResetPasswordSecondToken varchar(255),
	ResetPasswordSecondTokenValidFrom varchar(255)
);
alter table AuthUsersDB.users add constraint idx_users_email unique key(email);

create table AuthUsersDB.users
(
	id integer primary key,
	generated_at datetime,
	email varchar(100),
	encrypted_password varchar(100),
	name varchar(100),
	midname varchar(100),
	surname varchar(100),
	gender_id integer,
	birthday datetime,
	phone varchar(100),
	ResetPasswordSecondToken varchar(255),
	ResetPasswordSecondTokenValidFrom varchar(255),
	facebookid varchar(50),
	googleid varchar(50)
);
alter table AuthUsersDB.users add constraint idx_users_email unique key(email);

create table AuthUsersDB.email_validation
(
	email varchar(100) primary key,
	validation_token varchar(255)	
);

create table AuthUsersDB.ip_based_lock_tracks
(
	ip varchar(30) primary key,
	count_unsuccessful_attempts integer,
	last_attempt datetime
);

create table AuthUsersDB.user_based_lock_tracks
(
	email varchar(30) primary key,
	count_unsuccessful_attempts integer,
	last_attempt datetime
);

create table AuthUsersDB.ip_based_user_generation
(
	ip varchar(30) primary key,
	last_user_generated_time datetime
);
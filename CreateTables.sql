drop database if exists testing;

create database testing;

use testing;

create table users(
uid varchar(60) not null,
pword varchar(25) not null,
primary key (uid)
);

create table contact(
fname varchar(60) not null,
lname varchar(60),
phone varchar(60) not null,
email varchar(60),
uid varchar(60) not null,
    FOREIGN KEY (uid)
    REFERENCES users (uid)
    ON DELETE CASCADE
);
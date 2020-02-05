create table users(
uid varchar(60) not null,
pword varchar(25) not null,
primary key (uid)
);

create table contact(
PRIMARY KEY cid varchar(60),
fname varchar(60) not null,
lname varchar(60),
phone varchar(60) not null,
email varchar(60),
cid varchar(60) not null,
primary key (cid),
uid varchar(60) not null,
    FOREIGN KEY (uid)
    REFERENCES users (uid)
    ON DELETE CASCADE
);

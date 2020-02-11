-- Not actually needed until later.

CREATE TABLE user_account (
    name varchar(50)  NOT NULL,
    hashed_password varchar(50)  NOT NULL,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    thread_thread_id integer  NOT NULL,
    username varchar(20)  NOT NULL,
    user_account_id serial PRIMARY KEY
);

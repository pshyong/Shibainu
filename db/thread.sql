-- Only certain account holders can create a thread, hence NOT NULL.
CREATE TABLE thread (
    thread_id SERIAL PRIMARY KEY,
    subject varchar(100)  NOT NULL,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_account_id integer  NOT NULL,
    last_posted_by int  NULL,
    active_state boolean  NOT NULL DEFAULT TRUE,
    cat_id SERIAL REFERENCES category(cat_id)
);
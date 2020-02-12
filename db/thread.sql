-- Only certain account holders can create a thread, hence NOT NULL.
CREATE TABLE thread (
    thread_id SERIAL PRIMARY KEY,
    subject varchar(100)  NOT NULL,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_account_id integer NOT NULL,
    last_posted_by int NULL,
    active_state boolean  NOT NULL DEFAULT TRUE,
    number_of_views int default 0,
    number_of_posts int default 0,
    sub_cat_id SERIAL REFERENCES subcategory(sub_cat_id)
);
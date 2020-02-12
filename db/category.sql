-- Only special account holders can create a category, hence NOT NULL
CREATE TABLE Category (
    cat_id SERIAL PRIMARY KEY,
    title varchar(100)  NOT NULL,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_account_id integer NOT NULL,
    last_posted_by int  NULL,
    page_id SERIAL REFERENCES subpage(page_id)
);
-- Only special account holders can create a category, hence NOT NULL
CREATE TABLE Category (
    cat_id SERIAL PRIMARY KEY,
    subject varchar(100)  NOT NULL,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    page_id SERIAL REFERENCES subpage(page_id)
);
CREATE TABLE Subpage (
    page_id SERIAL PRIMARY KEY,
    title varchar(50) not NULL,
    visiter_count int  NOT NULL DEFAULT 0,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP
    title VARCHAR(50) NOT NULL
);
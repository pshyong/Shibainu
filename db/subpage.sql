CREATE TABLE Subpage (
    page_id SERIAL PRIMARY KEY,
    title varchar(50) UNIQUE NOT NULL,
    description varchar(500) NULL,
    visitor_count int  NOT NULL DEFAULT 0,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

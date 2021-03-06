DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;


DROP TABLE IF EXISTS user_account, post, thread, subcategory, category, subpage;

CREATE TABLE IF NOT EXISTS Subpage (
    page_id SERIAL PRIMARY KEY,
    title varchar(50) UNIQUE NOT NULL,
    description varchar(500) NULL,
    visiter_count int  NOT NULL DEFAULT 0,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Category (
    cat_id SERIAL PRIMARY KEY,
    subject varchar(100)  NOT NULL,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    page_id SERIAL REFERENCES subpage(page_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Subcategory (
    sub_cat_id SERIAL PRIMARY KEY,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    main_cat_id SERIAL REFERENCES Category(cat_id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL
);

CREATE TABLE thread (
    thread_id SERIAL PRIMARY KEY,
    subject varchar(100)  NOT NULL,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Need to change user_account_id back to NOT NULL when we have users working
    user_account_id integer DEFAULT 0,
    last_posted_by int NULL,
    active_state boolean  NOT NULL DEFAULT TRUE,
    number_of_views int default 0,
    number_of_posts int default 1,
    session_id VARCHAR(50) not NULL,
    sub_cat_id SERIAL REFERENCES subcategory(sub_cat_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Post (
    post_id SERIAL,
    content text  NOT NULL,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_account_id int DEFAULT 0,
    upvotes int  NOT NULL DEFAULT 0,
    downvotes int NOT NULL DEFAULT 0,
    session_id VARCHAR(50) not NULL,
    thread_id SERIAL REFERENCES thread(thread_id) ON DELETE CASCADE,
    PRIMARY KEY(post_id, thread_id)
);

CREATE TABLE IF NOT EXISTS User_account (
    name varchar(50)  NOT NULL,
    hashed_password varchar(50)  NOT NULL,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    thread_id integer  NOT NULL,
    username varchar(20) UNIQUE NOT NULL,
    user_account_id serial PRIMARY KEY
);
GRANT ALL PRIVILEGES ON DATABASE "301tester" TO "csc301";
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "csc301";
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO "csc301";

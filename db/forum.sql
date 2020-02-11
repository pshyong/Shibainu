CREATE TABLE Category (
    cat_id integer  NOT NULL,
    subject varchar(100)  NOT NULL,
    created timestamp  NOT NULL,
    user_account_id integer  NOT NULL,
    thread_ids int  NOT NULL,
    MainPage_main_id integer  NOT NULL,
    CONSTRAINT Category_pk PRIMARY KEY (cat_id)
);

-- Table: MainPage
CREATE TABLE MainPage (
    main_id integer  NOT NULL,
    Title varchar(100)  NOT NULL,
    cat_ids int  NOT NULL,
    CONSTRAINT MainPage_pk PRIMARY KEY (main_id)
);

-- Table: post
CREATE TABLE post (
    id integer  NOT NULL,
    content varchar(1000)  NOT NULL,
    created timestamp  NOT NULL,
    thread_id integer  NOT NULL,
    CONSTRAINT post_pk PRIMARY KEY (id)
);

-- Table: thread
CREATE TABLE thread (
    thread_id integer  NOT NULL,
    subject varchar(100)  NOT NULL,
    created timestamp  NOT NULL,
    post_ids integer  NOT NULL,
    user_account_id integer  NOT NULL,
    CONSTRAINT thread_pk PRIMARY KEY (thread_id)
);

-- Table: user_account
CREATE TABLE user_account (
    name varchar(50)  NOT NULL,
    hashed_password varchar(50)  NOT NULL,
    created timestamp  NOT NULL,
    thread_thread_id integer  NOT NULL,
    username varchar(20)  NOT NULL,
    CONSTRAINT user_account_pk PRIMARY KEY (username)
);

-- foreign keys
-- Reference: Category_MainPage (table: Category)
ALTER TABLE Category ADD CONSTRAINT Category_MainPage
    FOREIGN KEY (MainPage_main_id)
    REFERENCES MainPage (main_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: post_thread (table: post)
ALTER TABLE post ADD CONSTRAINT post_thread
    FOREIGN KEY (thread_id)
    REFERENCES thread (thread_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: thread_Category (table: thread)
ALTER TABLE thread ADD CONSTRAINT thread_Category
    FOREIGN KEY (post_ids)
    REFERENCES Category (cat_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;

-- Reference: user_account_thread (table: user_account)
ALTER TABLE user_account ADD CONSTRAINT user_account_thread
    FOREIGN KEY (thread_thread_id)
    REFERENCES thread (thread_id)  
    NOT DEFERRABLE 
    INITIALLY IMMEDIATE
;



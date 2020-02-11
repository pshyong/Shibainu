-- We can probably use session_id to track posts by anonymous user.
-- Set it to NULL until we can generate it automatically with our API.
-- user_account_id can be NULL for anonymous users.
CREATE TABLE post (
    post_id SERIAL PRIMARY KEY,
    content text  NOT NULL,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_account_id int  NULL,
    upvotes int  NOT NULL DEFAULT 0,
    session_id VARCHAR(50) NULL,
    thread_id SERIAL REFERENCES thread(thread_id)
);
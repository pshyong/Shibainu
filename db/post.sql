-- We can probably use session_id to track posts by anonymous user.
-- Set it to NULL until we can generate it automatically with our API.
-- user_account_id can be NULL for anonymous users.
CREATE TABLE post (
    post_id SERIAL,
    content text  NOT NULL,
    created timestamp  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_date timestamp DEFAULT CURRENT_TIMESTAMP,
    user_account_id int DEFAULT 0,
    upvotes int  NOT NULL DEFAULT 0,
    downvotes int NOT NULL DEFAULT 0,
    session_id VARCHAR(50) NOT NULL, -- Once their session expired, they cannot modify post anymore
    thread_id SERIAL REFERENCES thread(thread_id),
    PRIMARY KEY(post_id, thread_id)
);

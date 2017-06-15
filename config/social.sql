DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS friend_requests;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(250) NOT NULL,
    last_name VARCHAR(250) NOT NULL,
    email VARCHAR(250) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    profile_pic_url TEXT,
    bio VARCHAR(250)
);

CREATE TABLE friend_requests (
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    status VARCHAR(25) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

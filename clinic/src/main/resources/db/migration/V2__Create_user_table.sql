DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role_enum') THEN
        CREATE TYPE role_enum AS ENUM ('ADMIN','USER');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS role (
    id BIGSERIAL PRIMARY KEY,
    role role_enum NOT NULL,
);

CREATE TABLE IF NOT EXISTS user (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id BIGINT NOT NULL
);
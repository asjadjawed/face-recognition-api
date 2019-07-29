-- table generation SQL code, not used for reference only
-- will be implemented via knex migrations

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(50) UNIQUE NOT NULL,
  entries BIGINT DEFAULT 0,
  joined TIMESTAMP NOT NULL
);

CREATE TABLE login (
    id SERIAL PRIMARY KEY,
    user_id bigint UNIQUE NOT NULL REFERENCES users(id) MATCH SIMPLE ON UPDATE RESTRICT ON DELETE RESTRICT,
    hash character varying(100) NOT NULL      
);
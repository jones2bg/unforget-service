-- Remove any existing database and user.
DROP DATABASE IF EXISTS unforget;
DROP USER IF EXISTS unforget_user@localhost;

-- Create Unforget database and user. Ensure Unicode is fully supported.
CREATE DATABASE unforget CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE USER unforget_user@localhost IDENTIFIED WITH mysql_native_password BY 'Pizzaisgood!123';
GRANT ALL PRIVILEGES ON unforget.* TO unforget_user@localhost;
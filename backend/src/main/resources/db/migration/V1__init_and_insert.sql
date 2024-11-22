CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY, 
    username VARCHAR(50) NOT NULL,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(40),
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Types (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Roles (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Homes (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(50) NOT NULL,
    u_id INT,
    home_ip VARCHAR(45),
    FOREIGN KEY (u_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Rooms (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(50) NOT NULL,
    home_id INT,
    FOREIGN KEY (home_id) REFERENCES Homes(id)
);

CREATE TABLE IF NOT EXISTS Devices (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(50) NOT NULL,
    type_id INT,
    room_id INT,
    port VARCHAR(10),
    FOREIGN KEY (type_id) REFERENCES Types(id),
    FOREIGN KEY (room_id) REFERENCES Rooms(id)
);

CREATE TABLE IF NOT EXISTS Tokens (
    id SERIAL PRIMARY KEY, 
    refresh_token VARCHAR(255) NOT NULL,
    token_type VARCHAR(25),
    expiration_date TIMESTAMP,
    revoked BOOLEAN DEFAULT FALSE,
    expired BOOLEAN DEFAULT FALSE,
    u_id INT,
    FOREIGN KEY (u_id) REFERENCES Users(id)
);

CREATE TABLE IF NOT EXISTS Notification_Tokens (
    id SERIAL PRIMARY KEY, 
    token VARCHAR(45) NOT NULL,
    home_id INT,
    is_active BOOLEAN,
    expiration_date TIMESTAMP,
    FOREIGN KEY (home_id) REFERENCES Homes(id)
);
-- Insert roles if they don't already exist
INSERT INTO Roles (name) 
SELECT 'USER'
WHERE NOT EXISTS (SELECT 1 FROM Roles WHERE name = 'USER');

INSERT INTO Roles (name) 
SELECT 'ADMIN'
WHERE NOT EXISTS (SELECT 1 FROM Roles WHERE name = 'ADMIN');

INSERT INTO Types (name) 
SELECT 'LIGHT'
WHERE NOT EXISTS (SELECT 1 FROM Types WHERE name = 'LIGHT');

INSERT INTO Types (name) 
SELECT 'SCREEN'
WHERE NOT EXISTS (SELECT 1 FROM Types WHERE name = 'SCREEN');

INSERT INTO Types (name) 
SELECT 'CAMERA'
WHERE NOT EXISTS (SELECT 1 FROM Types WHERE name = 'CAMERA');

INSERT INTO Types (name) 
SELECT 'SENSOR'
WHERE NOT EXISTS (SELECT 1 FROM Types WHERE name = 'SENSOR');

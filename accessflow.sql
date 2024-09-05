CREATE DATABASE accessflow;
USE accessflow;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    role ENUM('student', 'teacher') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE passes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT,
    type ENUM('outpass', 'homepass') NOT NULL,
    status ENUM('pending', 'approved', 'denied') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP NULL,
    FOREIGN KEY (student_id) REFERENCES users(id)
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root@123';
FLUSH PRIVILEGES;

select * from users;


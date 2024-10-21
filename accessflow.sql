CREATE DATABASE accessflow;
USE accessflow;

CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

drop table pass_requests;

CREATE TABLE pass_requests (
    student_det VARCHAR(255),
    from_date DATETIME,
    to_date DATETIME,
    pass_type VARCHAR(50),
    reason VARCHAR(50),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    c_status varchar(255),
    remark varchar(255),
    passID INT AUTO_INCREMENT primary key
);

SELECT * FROM pass_requests;


ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root@123';
FLUSH PRIVILEGES;

SELECT * FROM teachers;
insert into students value (1, 'Jeevan','jee@gmail.com', 'jeevan', '2023-04-10T10:39:37');
SELECT * FROM students;

DELETE FROM students
WHERE id IN (13);  


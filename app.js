// app.js
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

// Initialize the app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // Make sure this is used after initializing app

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root@123',
  database: 'accessflow'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('MySQL connected');
});

// Serve static files from 'students' and 'teachers' directories
app.use('/students', express.static(path.join(__dirname, 'students')));
app.use('/teachers', express.static(path.join(__dirname, 'teachers')));

// Import routes
const studentRoutes = require('./routes/students')(db);
const teacherRoutes = require('./routes/teachers')(db);

// Use routes
app.use('/students/api', studentRoutes);
app.use('/teachers/api', teacherRoutes);

// Route for students login page
app.get('/students/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'students', 'index.html'));
});

// Route for teachers login page
app.get('/teachers/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'teachers', 'index.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});

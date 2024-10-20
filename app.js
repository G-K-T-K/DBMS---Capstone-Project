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

// Route to handle pass submissions
app.post('/students/applypass', (req, res) => {
  const {student_det, from_date, to_date, pass_type, reason } = req.body;

  // Retrieve student_id and name from session
  // const student_id = req.session.student_id;
  // const student_name = req.session.student_name;

  if (!student_det) {
    return res.status(401).json({ error: 'You need to log in first' });
  }

  // Insert the pass request into the database
  const query = `INSERT INTO pass_requests (student_det , from_date, to_date, pass_type, reason, c_status, remark)
                 VALUES (?, ?, ?, ?, ?, 'pending', 'Pending')`;

  db.query(query, [student_det, from_date, to_date, pass_type, reason], (err, result) => {
    if (err) {
      console.error('Error inserting pass request:', err);
      res.status(500).json({ error: 'Database insertion failed' });
    } else {
      console.log('Pass request submitted successfully');
      res.status(200).json({ message: 'Pass request submitted successfully' });
    }
  });
});
app.get('/students/viewpasses', (req, res) => {

  const query = `SELECT passID, student_det, pass_type, from_date, to_date, c_status, remark, submitted_at 
                 FROM pass_requests ORDER BY submitted_at DESC`;

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error retrieving passes:', err);
          return res.status(500).json({ error: 'Database query failed' });
      }
      return res.json(results);
  });
});
// Route to get all pass requests
app.get('/api/passes', (req, res) => {
  const query = 'SELECT * FROM pass_requests';
  connection.query(query, (error, results) => {
      if (error) {
          return res.status(500).send('Error fetching passes');
      }
      res.json(results);
  });
});
// Route to update pass status and remarks
app.post('/api/passes/update', (req, res) => {
  const { passID, c_status, remark } = req.body;

  let query = 'UPDATE pass_requests SET ';
  let updates = [];

  if (c_status) {
      updates.push(`c_status = '${c_status}'`); // Assume there's a `status` column in your table
  }

  if (remark) {
      updates.push(`remark = '${remark}'`); // Assume there's a `remark` column in your table
  }

  query += updates.join(', ');
  query += ` WHERE passID = ?`;

  db.query(query, [passID], (error, results) => {
      if (error) {
          console.error('Error updating pass:', error);
          return res.status(500).send('Error updating pass');
      }
      res.send('Pass updated successfully');
  });
});




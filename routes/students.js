const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../app'); // Ensure this exports your MySQL connection

// Register route for students
router.post('/signup', (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    return res.status(400).send('Passwords do not match');
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) throw err;
    const sql = 'INSERT INTO students (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error during student registration:', err);
        return res.status(500).send('Error registering student');
      }
      res.send('Student registered successfully');
    });
  });
});

// Login route for students
router.post('/signin', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM students WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).send('No student found');
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;

      if (isMatch) {
        const token = jwt.sign({ id: user.id, role: 'student' }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(400).send('Incorrect password');
      }
    });
  });
});

// Route for students to apply for a pass
router.post('/apply-pass', (req, res) => {
  const { studentId, passType, reason } = req.body;

  const sql = 'INSERT INTO passes (student_id, type, reason, status) VALUES (?, ?, ?, ?)';
  db.query(sql, [studentId, passType, reason, 'pending'], (err, result) => {
    if (err) throw err;
    res.send('Pass applied successfully');
  });
});

module.exports = router;
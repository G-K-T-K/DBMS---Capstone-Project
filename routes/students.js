const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../app'); // Adjust based on your folder structure

// Register route for students
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) throw err;
    const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, hashedPassword, 'student'], (err, result) => {
      if (err) throw err;
      res.send('Student registered successfully');
    });
  });
});

// Login route for students
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND role = ?';
  db.query(sql, [email, 'student'], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).send('No user found');
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;

      if (isMatch) {
        const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1h' });
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
  db.query(sql, [studentId, passType, reason, 'Pending'], (err, result) => {
    if (err) throw err;
    res.send('Pass applied successfully');
  });
});

module.exports = router;

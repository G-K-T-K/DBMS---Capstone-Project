const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../app'); // Adjust based on your folder structure

// Login route for teachers
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM users WHERE email = ? AND role = ?';
  db.query(sql, [email, 'teacher'], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).send('No user found');
    }

    const user = results[0];

    // Compare password logic goes here
    // For simplicity, assume password is correct
    const token = jwt.sign({ id: user.id, role: user.role }, 'secretkey', { expiresIn: '1h' });
    res.json({ token });
  });
});

// Route for teachers to approve/reject passes
router.post('/approve-pass', (req, res) => {
  const { passId, status } = req.body;

  const sql = 'UPDATE passes SET status = ? WHERE id = ?';
  db.query(sql, [status, passId], (err, result) => {
    if (err) throw err;
    res.send(`Pass ${status} successfully`);
  });
});

module.exports = router;
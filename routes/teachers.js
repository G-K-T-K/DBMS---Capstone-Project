const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../app'); // Ensure this exports your MySQL connection

// Login route for teachers
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT * FROM teachers WHERE email = ?';
  db.query(sql, [email], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).send('No teacher found');
    }

    const user = results[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) throw err;

      if (isMatch) {
        const token = jwt.sign({ id: user.id, role: 'teacher' }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
      } else {
        res.status(400).send('Incorrect password');
      }
    });
  });
});

// Route for teachers to approve/reject passes
router.post('/approve-pass', (req, res) => {
  const { passId, status } = req.body;

  const sql = 'UPDATE passes SET status = ?, approved_at = CURRENT_TIMESTAMP WHERE id = ?';
  db.query(sql, [status, passId], (err, result) => {
    if (err) throw err;
    res.send(`Pass ${status} successfully`);
  });
});

module.exports = router;
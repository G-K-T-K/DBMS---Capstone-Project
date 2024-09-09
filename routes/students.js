// routes/students.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
  const router = express.Router();

  // Login route for students
  router.post('/signin', (req, res) => {
    const { email, password } = req.body;

    console.log('Sign-in request received:', { email, password });

    // Check if the email exists in the students table
    const sql = 'SELECT * FROM students WHERE email = ?';
    db.query(sql, [email], (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (results.length === 0) {
        console.log('No user found with this email:', email);
        return res.status(400).json({ success: false, message: 'No user with that email found. Please register.' });
      }

      const user = results[0];
      console.log('User found:', user);

      // If user is found, compare the password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error('Error comparing passwords:', err);
          return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (isMatch) {
          // Passwords match, generate token or give access
          const token = jwt.sign({ id: user.id, email: user.email }, 'your_jwt_secret_key', { expiresIn: '1h' });
          console.log('Login successful for user:', email);
          return res.json({ success: true, message: 'Login successful', token });
        } else {
          console.log('Incorrect password for user:', email);
          return res.status(400).json({ success: false, message: 'Incorrect password' });
        }
      });
    });
  });

  return router;
};

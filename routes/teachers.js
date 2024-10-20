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
    const sql = 'SELECT * FROM teachers WHERE email = ?';
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

  // Signup route for students
  router.post('/signup', (req, res) => {
    const { name, email, password } = req.body;

    console.log('Signup request received:', { name, email, password });

    // Check if the email already exists in the database
    const sqlCheck = 'SELECT * FROM teachers WHERE email = ?';
    db.query(sqlCheck, [email], (err, results) => {
      if (err) {
        console.error('Error querying the database:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }

      if (results.length > 0) {
        console.log('Email already exists:', email);
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }

      // Hash the password before storing
      bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
          console.error('Error hashing the password:', err);
          return res.status(500).json({ success: false, message: 'Error hashing password' });
        }

        // Insert new student into the database including name
        const sqlInsert = 'INSERT INTO teachers (name, email, password) VALUES (?, ?, ?)';
        db.query(sqlInsert, [name, email, hashedPassword], (err, result) => {
          if (err) {
            console.error('Error inserting into the database:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
          }

          console.log('User registered successfully:', email);
          res.redirect('/teachers/teacherhome.html');
        });
      });
    });
  });
  return router;
};

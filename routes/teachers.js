const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = (db) => {
  const router = express.Router();

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

  // Other routes (e.g., approve-pass) will follow the same pattern
  // ...

  return router;
};

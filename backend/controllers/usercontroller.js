const db = require('../config/db');
const bcrypt = require('bcrypt');

// Get all users
exports.getUsers = (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Create user
exports.createUser = async (req, res) => {
  const { fullname, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const sql = 'INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)';
  db.query(sql, [fullname, username, hashedPassword], (err) => {
    if (err) return res.status(500).json({ error: 'User creation failed' });
    res.status(201).json({ message: 'User created' });
  });
};

// Update user
exports.updateUser = async (req, res) => {
  const { fullname, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  db.query(
    'UPDATE users SET fullname = ?, username = ?, password = ? WHERE id = ?',
    [fullname, username, hashedPassword, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Update failed' });
      res.json({ message: 'User updated' });
    }
  );
};

//Delete user
exports.deleteUser = (req, res) => {
  db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'Deletion failed' });
    res.json({ message: 'User deleted' });
  });
};

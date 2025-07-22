const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('../config/mailer');

const SECRET_KEY = 'superSecretKey123';

//--- Login ---
exports.loginUser = (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? LIMIT 1';
  db.query(sql, [username], async (err, results) => {
    if (err || results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = results[0];
    //console.log('🔍 Found user:', user.username);

    const match = await bcrypt.compare(password, user.password);
    //console.log('✅ Password match:', match);

    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
//console.log('✅ Login success, generating token...');
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
//console.log('📦 Token:', token);

    res.json({ token, user: { id: user.id, fullname: user.fullname, username: user.username } });
  });
};

//----reset password ----
exports.resetPassword = async (req, res) => {
  const { username, newPassword } = req.body; // ⬅️ match frontend key

  if (!username || !newPassword) {
    return res.status(400).json({ error: 'Username and new password required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const sql = 'UPDATE users SET password = ? WHERE username = ?';
    db.query(sql, [hashedPassword, username], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });

      res.status(200).json({ message: 'Password updated successfully' });
    });
  } catch (err) {
    //console.error('❌ Hashing error:', err);
    return res.status(500).json({ error: 'Internal error' });
  }
};





const bcrypt = require('bcryptjs');
const pool = require('../db');

// Login
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM Staff WHERE username = ?',
      [username]
    );
    connection.release();

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const staff = rows[0];
    const passwordMatch = await bcrypt.compare(password, staff.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    req.session.staffID = staff.staffID;
    req.session.username = staff.username;
    req.session.role = staff.role;

    res.json({ message: 'Login successful', staff: { staffID: staff.staffID, username: staff.username, role: staff.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Register (for initial setup)
exports.register = async (req, res) => {
  try {
    const { username, password, email, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO Staff (username, password, email, role) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, email || null, role || 'Operations']
    );
    connection.release();

    res.json({ message: 'Staff registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout failed' });
    }
    res.json({ message: 'Logout successful' });
  });
};

// Check Session
exports.checkSession = (req, res) => {
  if (req.session.staffID) {
    res.json({ authenticated: true, staff: { staffID: req.session.staffID, username: req.session.username, role: req.session.role } });
  } else {
    res.json({ authenticated: false });
  }
};


exports.getAllStaff = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT staffID, username, email, role FROM Staff');
    connection.release();
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
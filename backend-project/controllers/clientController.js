const pool = require('../db');

// Create Client
exports.createClient = async (req, res) => {
  try {
    const { clientName, clientType, telephone, email, district } = req.body;

    if (!clientName || !clientType || !telephone || !district) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO Client (clientName, clientType, telephone, email, district) VALUES (?, ?, ?, ?, ?)',
      [clientName, clientType, telephone, email || null, district]
    );
    connection.release();

    res.json({ message: 'Client created successfully', clientID: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Clients
exports.getAllClients = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Client');
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Client by ID
exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Client WHERE clientID = ?', [id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Client not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update Client
exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, clientType, telephone, email, district } = req.body;

    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE Client SET clientName = ?, clientType = ?, telephone = ?, email = ?, district = ? WHERE clientID = ?',
      [clientName, clientType, telephone, email, district, id]
    );
    connection.release();

    res.json({ message: 'Client updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete Client
exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM Client WHERE clientID = ?', [id]);
    connection.release();

    res.json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

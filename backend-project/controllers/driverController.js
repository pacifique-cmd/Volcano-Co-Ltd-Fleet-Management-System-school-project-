const pool = require('../db');

// Create Driver
exports.createDriver = async (req, res) => {
  try {
    const { firstName, lastName, licenseNumber, licenseClass, telephone, district, vehicleID } = req.body;

    if (!firstName || !lastName || !licenseNumber || !licenseClass || !telephone || !district) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO Driver (firstName, lastName, licenseNumber, licenseClass, telephone, district, vehicleID) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, licenseNumber, licenseClass, telephone, district, vehicleID || null]
    );
    connection.release();

    res.json({ message: 'Driver created successfully', driverID: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Drivers
exports.getAllDrivers = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Driver');
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Driver by ID
exports.getDriverById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Driver WHERE driverID = ?', [id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update Driver
exports.updateDriver = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, licenseNumber, licenseClass, telephone, district, vehicleID, status } = req.body;

    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE Driver SET firstName = ?, lastName = ?, licenseNumber = ?, licenseClass = ?, telephone = ?, district = ?, vehicleID = ?, status = ? WHERE driverID = ?',
      [firstName, lastName, licenseNumber, licenseClass, telephone, district, vehicleID || null, status || 'Active', id]
    );
    connection.release();

    res.json({ message: 'Driver updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete Driver
exports.deleteDriver = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM Driver WHERE driverID = ?', [id]);
    connection.release();

    res.json({ message: 'Driver deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const pool = require('../db');

// Create Vehicle
exports.createVehicle = async (req, res) => {
  try {
    const { plateNumber, make, model, yearOfManufacture, vehicleType, seatingCapacity } = req.body;

    if (!plateNumber || !make || !model || !yearOfManufacture || !vehicleType || !seatingCapacity) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO Vehicle (plateNumber, make, model, yearOfManufacture, vehicleType, seatingCapacity) VALUES (?, ?, ?, ?, ?, ?)',
      [plateNumber, make, model, yearOfManufacture, vehicleType, seatingCapacity]
    );
    connection.release();

    res.json({ message: 'Vehicle created successfully', vehicleID: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Vehicle');
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Vehicle WHERE vehicleID = ?', [id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update Vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { plateNumber, make, model, yearOfManufacture, vehicleType, seatingCapacity, status } = req.body;

    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE Vehicle SET plateNumber = ?, make = ?, model = ?, yearOfManufacture = ?, vehicleType = ?, seatingCapacity = ?, status = ? WHERE vehicleID = ?',
      [plateNumber, make, model, yearOfManufacture, vehicleType, seatingCapacity, status || 'Available', id]
    );
    connection.release();

    res.json({ message: 'Vehicle updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM Vehicle WHERE vehicleID = ?', [id]);
    connection.release();

    res.json({ message: 'Vehicle deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get available vehicles for a date range
exports.getAvailableVehicles = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT DISTINCT v.* FROM Vehicle v 
       WHERE v.status = 'Available' 
       AND v.vehicleID NOT IN (
         SELECT vehicleID FROM Booking 
         WHERE (startDate <= ? AND endDate >= ?)
         AND paymentStatus != 'Cancelled'
       )`,
      [endDate, startDate]
    );
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

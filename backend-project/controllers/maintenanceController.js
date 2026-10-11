const pool = require('../db');

// Create Maintenance Record
exports.createMaintenance = async (req, res) => {
  try {
    const { maintenanceDate, maintenanceType, cost, garage, description, vehicleID } = req.body;

    if (!maintenanceDate || !maintenanceType || !cost || !garage || !vehicleID) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }

    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO Maintenance (maintenanceDate, maintenanceType, cost, garage, description, vehicleID) VALUES (?, ?, ?, ?, ?, ?)',
      [maintenanceDate, maintenanceType, cost, garage, description || null, vehicleID]
    );
    connection.release();

    res.json({ message: 'Maintenance record created successfully', maintenanceID: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Maintenance Records
exports.getAllMaintenance = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Maintenance');
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Maintenance by ID
exports.getMaintenanceById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Maintenance WHERE maintenanceID = ?', [id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Maintenance by Vehicle ID
exports.getMaintenanceByVehicle = async (req, res) => {
  try {
    const { vehicleID } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Maintenance WHERE vehicleID = ? ORDER BY maintenanceDate DESC', [vehicleID]);
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update Maintenance
exports.updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const { maintenanceDate, maintenanceType, cost, garage, description } = req.body;

    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE Maintenance SET maintenanceDate = ?, maintenanceType = ?, cost = ?, garage = ?, description = ? WHERE maintenanceID = ?',
      [maintenanceDate, maintenanceType, cost, garage, description, id]
    );
    connection.release();

    res.json({ message: 'Maintenance record updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete Maintenance
exports.deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM Maintenance WHERE maintenanceID = ?', [id]);
    connection.release();

    res.json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const pool = require('../db');

// Generate Monthly Fleet Booking Report
exports.getMonthlyBookingReport = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ message: 'Year and month are required' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT 
        c.clientName,
        v.plateNumber,
        CONCAT(d.firstName, ' ', d.lastName) AS driverName,
        b.destination,
        b.startDate,
        b.endDate,
        b.totalFare,
        b.paymentStatus
      FROM Booking b
      JOIN Client c ON b.clientID = c.clientID
      JOIN Vehicle v ON b.vehicleID = v.vehicleID
      JOIN Driver d ON b.driverID = d.driverID
      WHERE YEAR(b.bookingDate) = ? AND MONTH(b.bookingDate) = ?
      ORDER BY b.bookingDate DESC`,
      [year, month]
    );
    connection.release();

    res.json({
      message: 'Monthly booking report generated successfully',
      month,
      year,
      data: rows,
      totalRecords: rows.length,
      totalRevenue: rows.reduce((sum, row) => sum + parseFloat(row.totalFare), 0)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Booking by Date Range
exports.getBookingsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'Start date and end date are required' });
    }

    const connection = await pool.getConnection();
    const [rows] = await connection.execute(
      `SELECT 
        c.clientName,
        v.plateNumber,
        CONCAT(d.firstName, ' ', d.lastName) AS driverName,
        b.destination,
        b.startDate,
        b.endDate,
        b.totalFare,
        b.paymentStatus
      FROM Booking b
      JOIN Client c ON b.clientID = c.clientID
      JOIN Vehicle v ON b.vehicleID = v.vehicleID
      JOIN Driver d ON b.driverID = d.driverID
      WHERE b.startDate >= ? AND b.endDate <= ?
      ORDER BY b.startDate DESC`,
      [startDate, endDate]
    );
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Fleet Performance Report
exports.getFleetPerformanceReport = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    
    // Total bookings per vehicle
    const [vehicleStats] = await connection.execute(
      `SELECT 
        v.vehicleID,
        v.plateNumber,
        v.vehicleType,
        COUNT(b.bookingID) as totalBookings,
        SUM(b.totalFare) as totalRevenue,
        COUNT(m.maintenanceID) as maintenanceCount,
        SUM(m.cost) as totalMaintenanceCost
      FROM Vehicle v
      LEFT JOIN Booking b ON v.vehicleID = b.vehicleID
      LEFT JOIN Maintenance m ON v.vehicleID = m.vehicleID
      GROUP BY v.vehicleID
      ORDER BY totalRevenue DESC`
    );

    // Revenue per client
    const [clientStats] = await connection.execute(
      `SELECT 
        c.clientID,
        c.clientName,
        c.clientType,
        COUNT(b.bookingID) as totalBookings,
        SUM(b.totalFare) as totalSpent
      FROM Client c
      LEFT JOIN Booking b ON c.clientID = b.clientID
      GROUP BY c.clientID
      ORDER BY totalSpent DESC`
    );

    // Driver trip records
    const [driverStats] = await connection.execute(
      `SELECT 
        d.driverID,
        CONCAT(d.firstName, ' ', d.lastName) as driverName,
        COUNT(b.bookingID) as totalTrips,
        COUNT(DISTINCT b.vehicleID) as vehiclesUsed
      FROM Driver d
      LEFT JOIN Booking b ON d.driverID = b.driverID
      GROUP BY d.driverID
      ORDER BY totalTrips DESC`
    );

    connection.release();

    res.json({
      vehicleStats,
      clientStats,
      driverStats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

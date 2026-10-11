const pool = require('../db');

// Fare calculation rates
const fareRates = {
  'Sedan': { baseFare: 25000, kmCharge: 50, insurance: 2000 },
  'Minibus': { baseFare: 60000, kmCharge: 80, insurance: 5000 },
  'Cargo Truck': { baseFare: 80000, kmCharge: 1200, insurance: 8000 },
  'SUV': { baseFare: 45000, kmCharge: 70, insurance: 3500 }
};

// Helper function to calculate fare
const calculateFare = (vehicleType, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) || 1;
  
  const rate = fareRates[vehicleType];
  if (!rate) {
    throw new Error('Invalid vehicle type');
  }

  const totalFare = (rate.baseFare * days) + rate.insurance;
  return totalFare;
};

// Create Booking
exports.createBooking = async (req, res) => {
  try {
    const { bookingDate, startDate, endDate, destination, clientID, vehicleID, driverID } = req.body;

    if (!bookingDate || !startDate || !endDate || !destination || !clientID || !vehicleID || !driverID) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get vehicle type for fare calculation
    const connection = await pool.getConnection();
    const [vehicleRows] = await connection.execute('SELECT vehicleType FROM Vehicle WHERE vehicleID = ?', [vehicleID]);
    
    if (vehicleRows.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const vehicleType = vehicleRows[0].vehicleType;
    const totalFare = calculateFare(vehicleType, startDate, endDate);

    const [result] = await connection.execute(
      'INSERT INTO Booking (bookingDate, startDate, endDate, destination, totalFare, clientID, vehicleID, driverID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [bookingDate, startDate, endDate, destination, totalFare, clientID, vehicleID, driverID]
    );
    connection.release();

    res.json({ message: 'Booking created successfully', bookingID: result.insertId, totalFare });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get All Bookings
exports.getAllBookings = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Booking');
    connection.release();

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Get Booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM Booking WHERE bookingID = ?', [id]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Update Booking
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingDate, startDate, endDate, destination, paymentStatus, clientID, vehicleID, driverID } = req.body;

    // Recalculate fare if dates changed
    let totalFare = null;
    if (startDate && endDate && vehicleID) {
      const connection = await pool.getConnection();
      const [vehicleRows] = await connection.execute('SELECT vehicleType FROM Vehicle WHERE vehicleID = ?', [vehicleID]);
      
      if (vehicleRows.length > 0) {
        const vehicleType = vehicleRows[0].vehicleType;
        totalFare = calculateFare(vehicleType, startDate, endDate);
      }
      connection.release();
    }

    const connection = await pool.getConnection();
    const updateQuery = totalFare 
      ? 'UPDATE Booking SET bookingDate = ?, startDate = ?, endDate = ?, destination = ?, totalFare = ?, paymentStatus = ?, clientID = ?, vehicleID = ?, driverID = ? WHERE bookingID = ?'
      : 'UPDATE Booking SET bookingDate = ?, startDate = ?, endDate = ?, destination = ?, paymentStatus = ?, clientID = ?, vehicleID = ?, driverID = ? WHERE bookingID = ?';
    
    const params = totalFare 
      ? [bookingDate, startDate, endDate, destination, totalFare, paymentStatus, clientID, vehicleID, driverID, id]
      : [bookingDate, startDate, endDate, destination, paymentStatus, clientID, vehicleID, driverID, id];

    await connection.execute(updateQuery, params);
    connection.release();

    res.json({ message: 'Booking updated successfully', totalFare });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// Delete Booking
exports.deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM Booking WHERE bookingID = ?', [id]);
    connection.release();

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

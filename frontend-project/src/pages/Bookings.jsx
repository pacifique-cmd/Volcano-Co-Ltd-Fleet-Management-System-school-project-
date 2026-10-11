import React, { useState, useEffect } from 'react';
import {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getAllVehicles,
  getAllDrivers,
  getAllClients,
  getAvailableVehicles,
} from '../utils/api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    bookingDate: new Date().toISOString().split('T')[0],
    startDate: '',
    endDate: '',
    destination: '',
    clientID: '',
    vehicleID: '',
    driverID: '',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [bookingsRes, vehiclesRes, driversRes, clientsRes] = await Promise.all([
        getAllBookings(),
        getAllVehicles(),
        getAllDrivers(),
        getAllClients(),
      ]);
      setBookings(bookingsRes.data);
      setVehicles(vehiclesRes.data);
      setDrivers(driversRes.data);
      setClients(clientsRes.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await updateBooking(editingId, formData);
      } else {
        await createBooking(formData);
      }
      setFormData({
        bookingDate: new Date().toISOString().split('T')[0],
        startDate: '',
        endDate: '',
        destination: '',
        clientID: '',
        vehicleID: '',
        driverID: '',
      });
      setShowForm(false);
      setEditingId(null);
      fetchAllData();
    } catch (err) {
      setError('Failed to save booking');
    }
  };

  const handleEdit = (booking) => {
    setFormData(booking);
    setEditingId(booking.bookingID);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteBooking(id);
        fetchAllData();
      } catch (err) {
        setError('Failed to delete booking');
      }
    }
  };

  const getClientName = (clientID) => {
    const client = clients.find((c) => c.clientID === clientID);
    return client ? client.clientName : 'N/A';
  };

  const getVehiclePlate = (vehicleID) => {
    const vehicle = vehicles.find((v) => v.vehicleID === vehicleID);
    return vehicle ? vehicle.plateNumber : 'N/A';
  };

  const getDriverName = (driverID) => {
    const driver = drivers.find((d) => d.driverID === driverID);
    return driver ? `${driver.firstName} ${driver.lastName}` : 'N/A';
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) setEditingId(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            {showForm ? 'Cancel' : 'New Booking'}
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingId ? 'Edit Booking' : 'Create New Booking'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Booking Date
                  </label>
                  <input
                    type="date"
                    name="bookingDate"
                    value={formData.bookingDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Destination
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Client
                  </label>
                  <select
                    name="clientID"
                    value={formData.clientID}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                      <option key={client.clientID} value={client.clientID}>
                        {client.clientName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Vehicle
                  </label>
                  <select
                    name="vehicleID"
                    value={formData.vehicleID}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">Select Vehicle</option>
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.vehicleID} value={vehicle.vehicleID}>
                        {vehicle.plateNumber} ({vehicle.vehicleType})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Driver
                  </label>
                  <select
                    name="driverID"
                    value={formData.driverID}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option value="">Select Driver</option>
                    {drivers.map((driver) => (
                      <option key={driver.driverID} value={driver.driverID}>
                        {driver.firstName} {driver.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
              >
                {editingId ? 'Update Booking' : 'Create Booking'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Client</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Vehicle</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Driver</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Start Date</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">End Date</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Destination</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Total Fare (RWF)</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.bookingID} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{getClientName(booking.clientID)}</td>
                    <td className="px-6 py-3">{getVehiclePlate(booking.vehicleID)}</td>
                    <td className="px-6 py-3">{getDriverName(booking.driverID)}</td>
                    <td className="px-6 py-3">{booking.startDate}</td>
                    <td className="px-6 py-3">{booking.endDate}</td>
                    <td className="px-6 py-3">{booking.destination}</td>
                    <td className="px-6 py-3 font-semibold">{booking.totalFare}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded-full text-white text-sm ${
                        booking.paymentStatus === 'Paid' ? 'bg-green-600' :
                        booking.paymentStatus === 'Pending' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleEdit(booking)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(booking.bookingID)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;

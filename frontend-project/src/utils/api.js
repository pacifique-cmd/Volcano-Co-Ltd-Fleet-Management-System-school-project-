import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth endpoints
export const login = (username, password) =>
  api.post('/auth/login', { username, password });

export const logout = () =>
  api.post('/auth/logout');

export const checkSession = () =>
  api.get('/auth/check-session');

export const register = (username, password, email, role) =>
  api.post('/auth/register', { username, password, email, role });

// Vehicle endpoints
export const getAllVehicles = () =>
  api.get('/vehicles');

export const getVehicleById = (id) =>
  api.get(`/vehicles/${id}`);

export const createVehicle = (data) =>
  api.post('/vehicles', data);

export const updateVehicle = (id, data) =>
  api.put(`/vehicles/${id}`, data);

export const deleteVehicle = (id) =>
  api.delete(`/vehicles/${id}`);

export const getAvailableVehicles = (startDate, endDate) =>
  api.get('/vehicles/available', { params: { startDate, endDate } });

// Driver endpoints
export const getAllDrivers = () =>
  api.get('/drivers');

export const getDriverById = (id) =>
  api.get(`/drivers/${id}`);

export const createDriver = (data) =>
  api.post('/drivers', data);

export const updateDriver = (id, data) =>
  api.put(`/drivers/${id}`, data);

export const deleteDriver = (id) =>
  api.delete(`/drivers/${id}`);

// Client endpoints
export const getAllClients = () =>
  api.get('/clients');

export const getClientById = (id) =>
  api.get(`/clients/${id}`);

export const createClient = (data) =>
  api.post('/clients', data);

export const updateClient = (id, data) =>
  api.put(`/clients/${id}`, data);

export const deleteClient = (id) =>
  api.delete(`/clients/${id}`);

// Booking endpoints
export const getAllBookings = () =>
  api.get('/bookings');

export const getBookingById = (id) =>
  api.get(`/bookings/${id}`);

export const createBooking = (data) =>
  api.post('/bookings', data);

export const updateBooking = (id, data) =>
  api.put(`/bookings/${id}`, data);

export const deleteBooking = (id) =>
  api.delete(`/bookings/${id}`);

// Maintenance endpoints
export const getAllMaintenance = () =>
  api.get('/maintenance');

export const getMaintenanceById = (id) =>
  api.get(`/maintenance/${id}`);

export const createMaintenance = (data) =>
  api.post('/maintenance', data);

export const updateMaintenance = (id, data) =>
  api.put(`/maintenance/${id}`, data);

export const deleteMaintenance = (id) =>
  api.delete(`/maintenance/${id}`);

export const getMaintenanceByVehicle = (vehicleID) =>
  api.get(`/maintenance/vehicle/${vehicleID}`);

// Report endpoints
export const getMonthlyBookingReport = (year, month) =>
  api.get('/reports/monthly', { params: { year, month } });

export const getFleetPerformanceReport = () =>
  api.get('/reports/performance');

export const getBookingsByDateRange = (startDate, endDate) =>
  api.get('/reports/date-range', { params: { startDate, endDate } });

export default api;

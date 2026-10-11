import React, { useState, useEffect } from 'react';
import {
  getAllMaintenance,
  createMaintenance,
  getAllVehicles,
  updateMaintenance,
  deleteMaintenance,
} from '../utils/api';

const Maintenance = () => {
  const [maintenance, setMaintenance] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    maintenanceDate: new Date().toISOString().split('T')[0],
    maintenanceType: 'General Service',
    cost: '',
    garage: '',
    description: '',
    vehicleID: '',
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const [maintenanceRes, vehiclesRes] = await Promise.all([
        getAllMaintenance(),
        getAllVehicles(),
      ]);
      setMaintenance(maintenanceRes.data);
      setVehicles(vehiclesRes.data);
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
        await updateMaintenance(editingId, formData);
      } else {
        await createMaintenance(formData);
      }
      setFormData({
        maintenanceDate: new Date().toISOString().split('T')[0],
        maintenanceType: 'General Service',
        cost: '',
        garage: '',
        description: '',
        vehicleID: '',
      });
      setShowForm(false);
      setEditingId(null);
      fetchAllData();
    } catch (err) {
      setError('Failed to save maintenance record');
    }
  };

  const handleEdit = (record) => {
    setFormData(record);
    setEditingId(record.maintenanceID);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await deleteMaintenance(id);
        fetchAllData();
      } catch (err) {
        setError('Failed to delete maintenance record');
      }
    }
  };

  const getVehiclePlate = (vehicleID) => {
    const vehicle = vehicles.find((v) => v.vehicleID === vehicleID);
    return vehicle ? vehicle.plateNumber : 'N/A';
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Management</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) setEditingId(null);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            {showForm ? 'Cancel' : 'Add Maintenance'}
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
              {editingId ? 'Edit Maintenance Record' : 'Add New Maintenance Record'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Maintenance Date
                  </label>
                  <input
                    type="date"
                    name="maintenanceDate"
                    value={formData.maintenanceDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
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
                        {vehicle.plateNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Maintenance Type
                  </label>
                  <select
                    name="maintenanceType"
                    value={formData.maintenanceType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  >
                    <option>Oil Change</option>
                    <option>Tire Replacement</option>
                    <option>General Service</option>
                    <option>Repair</option>
                    <option>Inspection</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Cost (RWF)
                  </label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Garage
                  </label>
                  <input
                    type="text"
                    name="garage"
                    value={formData.garage}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    rows="3"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
              >
                {editingId ? 'Update Record' : 'Add Record'}
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
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Vehicle</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Maintenance Date</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Type</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Cost (RWF)</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Garage</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Description</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {maintenance.map((record) => (
                  <tr key={record.maintenanceID} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-3">{getVehiclePlate(record.vehicleID)}</td>
                    <td className="px-6 py-3">{record.maintenanceDate}</td>
                    <td className="px-6 py-3">{record.maintenanceType}</td>
                    <td className="px-6 py-3 font-semibold">{record.cost}</td>
                    <td className="px-6 py-3">{record.garage}</td>
                    <td className="px-6 py-3">{record.description}</td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => handleEdit(record)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(record.maintenanceID)}
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

export default Maintenance;

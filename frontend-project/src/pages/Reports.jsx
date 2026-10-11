import React, { useState, useEffect } from 'react';
import { getMonthlyBookingReport, getFleetPerformanceReport } from '../utils/api';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('monthly');
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const generateMonthlyReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getMonthlyBookingReport(year, month);
      setReportData(response.data);
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const generatePerformanceReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getFleetPerformanceReport();
      setPerformanceData(response.data);
    } catch (err) {
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    if (reportType === 'monthly') {
      generateMonthlyReport();
    } else if (reportType === 'performance') {
      generatePerformanceReport();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Fleet Reports</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Report Generator */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">Report Generator</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="monthly">Monthly Booking Report</option>
                <option value="performance">Fleet Performance Report</option>
              </select>
            </div>

            {reportType === 'monthly' && (
              <>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Month
                  </label>
                  <select
                    value={month}
                    onChange={(e) => setMonth(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {new Date(2024, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value={2023}>2023</option>
                    <option value={2024}>2024</option>
                    <option value={2025}>2025</option>
                  </select>
                </div>
              </>
            )}

            <div className="flex items-end">
              <button
                onClick={handleGenerateReport}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:bg-gray-400"
              >
                {loading ? 'Generating...' : 'Generate Report'}
              </button>
            </div>
          </div>
        </div>

        {/* Monthly Booking Report */}
        {reportData && reportType === 'monthly' && (
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold mb-4">
              Monthly Booking Report - {new Date(2024, month - 1).toLocaleString('default', { month: 'long' })} {year}
            </h2>
            <div className="mb-4 p-4 bg-blue-100 rounded">
              <p className="text-lg font-semibold">
                Total Records: {reportData.totalRecords} | Total Revenue: RWF {reportData.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Client Name</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Vehicle Plate</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Driver Name</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Destination</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Start Date</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">End Date</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Total Fare (RWF)</th>
                    <th className="px-6 py-3 text-left text-gray-700 font-semibold">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.data.map((row, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-3">{row.clientName}</td>
                      <td className="px-6 py-3">{row.plateNumber}</td>
                      <td className="px-6 py-3">{row.driverName}</td>
                      <td className="px-6 py-3">{row.destination}</td>
                      <td className="px-6 py-3">{row.startDate}</td>
                      <td className="px-6 py-3">{row.endDate}</td>
                      <td className="px-6 py-3 font-semibold">{row.totalFare}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-white text-sm ${
                          row.paymentStatus === 'Paid' ? 'bg-green-600' :
                          row.paymentStatus === 'Pending' ? 'bg-yellow-600' : 'bg-red-600'
                        }`}>
                          {row.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Fleet Performance Report */}
        {performanceData && reportType === 'performance' && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-8">Fleet Performance Report</h2>

            {/* Vehicle Stats */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Vehicle Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Plate Number</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Vehicle Type</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Total Bookings</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Total Revenue (RWF)</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Maintenance Count</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Maintenance Cost (RWF)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.vehicleStats.map((row, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-3">{row.plateNumber}</td>
                        <td className="px-6 py-3">{row.vehicleType}</td>
                        <td className="px-6 py-3">{row.totalBookings}</td>
                        <td className="px-6 py-3 font-semibold">{row.totalRevenue || 0}</td>
                        <td className="px-6 py-3">{row.maintenanceCount}</td>
                        <td className="px-6 py-3">{row.totalMaintenanceCost || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Client Stats */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Client Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Client Name</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Client Type</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Total Bookings</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Total Spent (RWF)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.clientStats.map((row, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-3">{row.clientName}</td>
                        <td className="px-6 py-3">{row.clientType}</td>
                        <td className="px-6 py-3">{row.totalBookings}</td>
                        <td className="px-6 py-3 font-semibold">{row.totalSpent || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Driver Stats */}
            <div>
              <h3 className="text-xl font-bold mb-4">Driver Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Driver Name</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Total Trips</th>
                      <th className="px-6 py-3 text-left text-gray-700 font-semibold">Vehicles Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.driverStats.map((row, index) => (
                      <tr key={index} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-3">{row.driverName}</td>
                        <td className="px-6 py-3">{row.totalTrips}</td>
                        <td className="px-6 py-3">{row.vehiclesUsed}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;

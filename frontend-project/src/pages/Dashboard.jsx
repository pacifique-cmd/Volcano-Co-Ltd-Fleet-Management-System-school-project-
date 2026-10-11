import React from 'react';

const Dashboard = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Fleet Management Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Vehicles</h3>
            <p className="text-3xl font-bold text-blue-600">60+</p>
            <p className="text-gray-500">Total Fleet</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Drivers</h3>
            <p className="text-3xl font-bold text-green-600">70+</p>
            <p className="text-gray-500">Professional Drivers</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Clients</h3>
            <p className="text-3xl font-bold text-purple-600">500+</p>
            <p className="text-gray-500">Active Clients</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Bookings</h3>
            <p className="text-3xl font-bold text-orange-600">1,000+</p>
            <p className="text-gray-500">Monthly Bookings</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to VCFMS
          </h2>
          <p className="text-gray-700 mb-4">
            Volcano Co Ltd Fleet Management System is your centralized platform for
            managing all fleet operations including:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
            <li>Vehicle registration and management</li>
            <li>Driver profile management</li>
            <li>Client database</li>
            <li>Booking management with automatic fare calculation</li>
            <li>Maintenance tracking</li>
            <li>Fleet performance reports</li>
          </ul>
          <p className="text-gray-700">
            Use the navigation menu to access different modules and manage your fleet efficiently.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

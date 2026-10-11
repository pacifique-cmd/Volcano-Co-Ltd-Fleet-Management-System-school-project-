import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../utils/api';

const Navbar = ({ user, setAuthenticated, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setAuthenticated(false);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold hover:text-blue-200">
              VCFMS
            </Link>
            <div className="flex space-x-4">
              <Link to="/vehicles" className="hover:text-blue-200 transition">
                Vehicles
              </Link>
              <Link to="/drivers" className="hover:text-blue-200 transition">
                Drivers
              </Link>
              <Link to="/clients" className="hover:text-blue-200 transition">
                Clients
              </Link>
              <Link to="/bookings" className="hover:text-blue-200 transition">
                Bookings
              </Link>
              <Link to="/maintenance" className="hover:text-blue-200 transition">
                Maintenance
              </Link>
              <Link to="/reports" className="hover:text-blue-200 transition">
                Reports
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">{user?.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

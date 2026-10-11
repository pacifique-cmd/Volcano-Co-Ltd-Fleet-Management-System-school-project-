import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { checkSession } from './utils/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Clients from './pages/Clients';
import Bookings from './pages/Bookings';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';
import Navbar from './components/Navbar';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkSession();
        if (response.data.authenticated) {
          setAuthenticated(true);
          setUser(response.data.staff);
        }
      } catch (error) {
        console.log('Not authenticated');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-2xl font-bold text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {authenticated && <Navbar user={user} setAuthenticated={setAuthenticated} setUser={setUser} />}
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={authenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!authenticated ? <Login setAuthenticated={setAuthenticated} setUser={setUser} /> : <Navigate to="/" />}
            />
            <Route
              path="/vehicles"
              element={authenticated ? <Vehicles /> : <Navigate to="/login" />}
            />
            <Route
              path="/drivers"
              element={authenticated ? <Drivers /> : <Navigate to="/login" />}
            />
            <Route
              path="/clients"
              element={authenticated ? <Clients /> : <Navigate to="/login" />}
            />
            <Route
              path="/bookings"
              element={authenticated ? <Bookings /> : <Navigate to="/login" />}
            />
            <Route
              path="/maintenance"
              element={authenticated ? <Maintenance /> : <Navigate to="/login" />}
            />
            <Route
              path="/reports"
              element={authenticated ? <Reports /> : <Navigate to="/login" />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;

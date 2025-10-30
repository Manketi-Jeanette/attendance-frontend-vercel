import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import AttendanceForm from './components/AttendanceForm';
import AttendanceDashboard from './components/AttendanceDashboard';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('form');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get API base URL from environment variable
  const API_URL = process.env.REACT_APP_API_URL || '';

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/attendance`);
      setAttendanceRecords(response.data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      alert('Failed to fetch attendance records');
    }
    setLoading(false);
  };

  useEffect(() => {
    if (currentView === 'dashboard') {
      fetchAttendance();
    }
  }, [currentView]);

  const handleAttendanceSubmit = async (attendanceData) => {
    try {
      await axios.post(`${API_URL}/api/attendance`, attendanceData);
      alert('Attendance recorded successfully!');
    } catch (error) {
      console.error('Error submitting attendance:', error);
      alert('Failed to record attendance');
    }
  };

  return (
    <div className="App d-flex flex-column min-vh-100">
      <nav className="navbar navbar-dark bg-primary">
        <div className="container">
          <span className="navbar-brand mb-0 h1">Employee Attendance Tracker</span>
          <div className="navbar-nav flex-row">
            <button 
              className={`nav-link btn btn-link ${currentView === 'form' ? 'active' : ''}`}
              onClick={() => setCurrentView('form')}
            >
              Mark Attendance
            </button>
            <button 
              className={`nav-link btn btn-link ${currentView === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentView('dashboard')}
            >
              View Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="container mt-4 flex-grow-1">
        {currentView === 'form' && (
          <AttendanceForm onSubmit={handleAttendanceSubmit} />
        )}
        
        {currentView === 'dashboard' && (
          <AttendanceDashboard 
            records={attendanceRecords} 
            loading={loading}
            onRefresh={fetchAttendance}
          />
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p className="mb-0">&copy; 2024 Employee Attendance Tracker</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
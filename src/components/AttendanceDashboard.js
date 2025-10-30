import React, { useState } from 'react';
import axios from 'axios';

const AttendanceDashboard = ({ records, loading, onRefresh }) => {
  const [filterDate, setFilterDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get API base URL from environment variable
  const API_URL = process.env.REACT_APP_API_URL || '';

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await axios.delete(`${API_URL}/api/attendance/${id}`);
        onRefresh();
        alert('Record deleted successfully');
      } catch (error) {
        console.error('Error deleting record:', error);
        alert('Failed to delete record');
      }
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesDate = !filterDate || record.date === filterDate;
    const matchesSearch = !searchTerm || 
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeID.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDate && matchesSearch;
  });

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h4>Attendance Dashboard</h4>
        <button className="btn btn-secondary" onClick={onRefresh}>
          Refresh
        </button>
      </div>
      
      <div className="card-body">
        {/* Bonus Features: Filter and Search */}
        <div className="row mb-3">
          <div className="col-md-6">
            <label htmlFor="filterDate" className="form-label">Filter by Date</label>
            <input
              type="date"
              className="form-control"
              id="filterDate"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="searchTerm" className="form-label">Search by Name or ID</label>
            <input
              type="text"
              className="form-control"
              id="searchTerm"
              placeholder="Enter name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-4">
            <p>No attendance records found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Employee ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map(record => (
                  <tr key={record.id}>
                    <td>{record.employeeName}</td>
                    <td>{record.employeeID}</td>
                    <td>{record.date}</td>
                    <td>
                      <span className={`badge ${record.status === 'Present' ? 'bg-success' : 'bg-danger'}`}>
                        {record.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(record.id)}
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

export default AttendanceDashboard;
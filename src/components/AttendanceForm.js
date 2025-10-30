import React, { useState } from 'react';

const AttendanceForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeID: '',
    date: new Date().toISOString().split('T')[0],
    status: 'Present'
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validation
    if (!formData.employeeName.trim() || !formData.employeeID.trim()) {
      setMessage('Please fill in all required fields');
      setIsError(true);
      setIsSubmitting(false);
      return;
    }

    try {
      await onSubmit(formData);
      setMessage('Attendance recorded successfully!');
      setIsError(false);
      
      // Reset form
      setFormData({
        employeeName: '',
        employeeID: '',
        date: new Date().toISOString().split('T')[0],
        status: 'Present'
      });
    } catch (error) {
      setMessage('Failed to record attendance. Please try again.');
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }

    // Clear message after 5 seconds
    setTimeout(() => {
      setMessage('');
    }, 5000);
  };

  return (
    <div className="card">
      <div className="card-header bg-white">
        <h4 className="text-primary mb-0">Mark Attendance</h4>
      </div>
      <div className="card-body">
        {message && (
          <div className={`alert ${isError ? 'alert-danger' : 'alert-success'} d-flex align-items-center`}>
            {isError ? '❌' : '✅'} {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="employeeName" className="form-label fw-semibold">
              Employee Name *
            </label>
            <input
              type="text"
              className="form-control"
              id="employeeName"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              placeholder="Enter employee name"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="employeeID" className="form-label fw-semibold">
              Employee ID *
            </label>
            <input
              type="text"
              className="form-control"
              id="employeeID"
              name="employeeID"
              value={formData.employeeID}
              onChange={handleChange}
              placeholder="Enter employee ID"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="date" className="form-label fw-semibold">
              Date
            </label>
            <input
              type="date"
              className="form-control"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="status" className="form-label fw-semibold">
              Status
            </label>
            <select
              className="form-select"
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2 fw-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Submitting...
              </>
            ) : (
              'Submit Attendance'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AttendanceForm;